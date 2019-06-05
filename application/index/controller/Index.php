<?php
namespace app\index\controller;
use app\index\model\Login as LoginModel;
use app\index\model\UserInfo as UserInfoModel;

use think\Cookie;
use think\Request;
use think\Session;
use think\Cache;
use think\Db;

class Index extends Base
{
    //渲染页面
    public function index()
    {
        $this -> isRememberLogin(); //用户自动登录
        $this -> alreadyLogin(); //防止用户重复登陆
        return $this->fetch();
    }

    public function server(){
        return $this -> fetch();
    }

    public function forget(){
        return $this -> fetch();
    }

    //个人信息修改界面
    public function modify(){
        return $this -> fetch();
    }

    //退出登录
    public function logout(){
        //注销session
        Session::delete('user_info');
        Cookie::delete('account', 'user_');
        Cookie::delete('password', 'user_');
        Session::delete('directory');
        Session::delete('files');
        Session::delete('useSpace');
        Session::delete('useSpaceFormat');
        $this -> success('退出成功，正在返回！','http://cloud2.test/');
    }

    //是否存在账号
    public function haveAccount($account){
        $flag = false;
        $login = new LoginModel();
        $result = $login -> where('login_account', $account) -> find();
        if($result)
            $flag = true;
        return $flag;
    }

    //确认账号密码是否正确
    public function checkPassword($account, $password){
        $flag = false;
        $login = new LoginModel();
        $result = $login -> where('login_account', $account) -> find();
        if($result['password'] == $password)
            $flag = true;
        return $flag;
    }

    //账号密码登录检查
    public function accountLoginCheck(Request $request){
        //获取ajax提交的数据
        $data = $request -> param();
        //初始化返回参数
        $status = 0 ;           //验证标志，0|1 —— 失败|成功
        $result = '验证失败！';   //失败提示信息

        //创建验证规则
        $rule = [
            'account|账号'       => 'require',         //账号必填
            'password|密码'      => 'require',         //密码必填
            'verify|验证码'      => 'require|captcha', //验证码必填|自动验证
            'remember|记住密码'  => 'require',         //记住账号？
        ];

        //自定义验证失败的提示信息
        $msg = [
            'account'  => ['require' => '账号不能为空！'],
            'password' => ['require' => '密码不能为空！'],
            'verify'   => [
                'require' => '验证码不能为空！',
                'captcha' => '验证码错误！请刷新后重新输入！'
            ],
        ];

        //进行验证
        //只会返回两种值：如果是true -> 表示验证通过，如果返回字符串，则是用户自定义的错误提示
        $verify = $this -> validate($data, $rule, $msg);

        //处理数据
        if(is_string($verify)){      //检测数据完整性和验证码是否正确
            if($verify == '验证码错误！请刷新后重新输入！')
                $status = 4;
            else
                $status = 0;
            $result = $verify;
        }else if(!($this -> haveAccount($data['account']))) { //检测账号是否存在
            $status = 2;
            $result = '账号不存在，请先注册！';
        }else if(!($this -> checkPassword($data['account'],md5($data['password'])))){ //检测账号密码是否对应
            $status = 3;
            $result = '账号或密码不正确！';
        }else{ //检测是否记住密码
            if($data['remember'] == 'true'){    //字符串（'true','false'）都默认为true
                //进行记住密码操作(cookie一周有效期)
                Cookie::set('account',$data['account'],['prefix'=>'user_','expire'=>3600*24*7]);
                Cookie::set('password',md5($data['password']),['prefix'=>'user_','expire'=>3600*24*7]);
            }
            $login_id = LoginModel::where('login_account', $data['account']) -> find();
            $login_id -> save([
                'latest_login_datetime' => date("Y-m-d H:i:s",time()),
                'latest_login_ip' => $this -> getIp(),
            ],['login_id' => $login_id['login_id']]);
            Session::set('user_info', UserInfoModel::where('login_id', $login_id['login_id'])->find());//user_info信息

            $status = 1;
            $result = '账号密码验证成功！';
        }

        //ajax返回数据
        return ['status'=>$status ,'message' =>$result, 'data' =>$data];
    }

    //邮箱验证码登录
    public function emailLoginCheck(Request $request){
        //获取ajax提交的数据
        $data = $request -> param();
        //初始化返回参数
        $status = 0 ;           //验证标志，0|1 —— 失败|成功
        $result = '验证失败！';   //失败提示信息

        //创建验证规则
        $rule = [
            'email|邮箱'     => 'require',         //密码必填
            'verify|验证码'  => 'require',         //验证码必填
        ];

        //自定义验证失败的提示信息
        $msg = [
            'email'     => ['require' => '邮箱不能为空！'],
            'verify'    => ['require' => '验证码不能为空！'],
        ];

        //进行验证
        //只会返回两种值：如果是true -> 表示验证通过，如果返回字符串，则是用户自定义的错误提示
        $verify = $this -> validate($data, $rule, $msg);

        //处理数据
        if(is_string($verify)){      //检测数据完整性
            $status = 0;
            $result = '数据不完整！';
        }else if(!UserInfoModel::getByEmail($data['email'])){    //检测邮箱是否被注册
            $status = 2;
            $result = '邮箱未绑定账号！';
        }else if(!($this -> getEmailCodCacheAndEmail('login')['email'] == $data['email'] &&
                   $this -> getEmailCodCacheAndEmail('login')['emailCode'] == $data['verify'])){ //检测输入的邮箱验证码是否正确
            $status = 3;
            $result = '邮箱和验证码不匹配！';
        }else{
            $status = 1;
            $result = '邮箱验证成功！';

            $user_info = UserInfoModel::getByEmail($data['email']);
            Session::set('user_info', $user_info);
        }

        //ajax返回数据
        return ['status'=>$status ,'message' =>$result, 'data' =>$data];
    }

    //注册后选择自动登录
    public function registerLogin(Request $request){
        //初始化返回参数
        $status = 0 ;           //验证标志，0|1 —— 失败|成功
        $result = '自动登录失败！';   //失败提示信息

        $account = Cache::get('login_account');
        $password = Cache::get('password');

        $flag = $this -> checkPassword($account, $password);

        if($flag){
            $login_id = LoginModel::where('login_account', $account) -> find();
            $user_info = UserInfoModel::where('login_id', $login_id['login_id']) -> find();
            Session::set('user_info', $user_info);//user_info信息
            $status = 1;           //验证标志，0|1 —— 失败|成功
            $result = '自动登录成功！';   //失败提示信息
        }

        return ['status'=>$status ,'message' =>$result];
    }

    //注册账号
    public function register(Request $request){
        //获取ajax提交的数据
        $data = $request -> param();
        //初始化返回参数
        $status = 0 ;           //验证标志，0|1 —— 失败|成功
        $result = '注册失败！';   //失败提示信息

        //创建验证规则
        $rule = [
            'account|账号'   => 'require',         //账号必填
            'password1|密码' => 'require',         //密码必填
            'password2|密码' => 'require',         //密码必填
            'email|邮箱'     => 'require',         //密码必填
            'verify|验证码'  => 'require',         //验证码必填
        ];

        //自定义验证失败的提示信息
        $msg = [
            'account'   => ['require' => '账号不能为空！'],
            'password1' => ['require' => '密码不能为空！'],
            'password2' => ['require' => '密码不能为空！'],
            'email'     => ['require' => '邮箱不能为空！'],
            'verify'    => ['require' => '验证码不能为空！'],
        ];

        //进行验证
        //只会返回两种值：如果是true -> 表示验证通过，如果返回字符串，则是用户自定义的错误提示
        $verify = $this -> validate($data, $rule, $msg);

        //处理数据
        if(is_string($verify)){      //检测数据完整性
            $status = 0;
            $result = '数据不完整！';
        }else if($data['password1'] != $data['password2']){ //检测两次输入的密码是否相等
            $status = 0;
            $result = '两次输入的密码不一致！';
        }else if(LoginModel::where('login_account',$data['account'])->find()){    //检测账号是否存在
            $status = 2;
            $result = '账号已被注册！';
        }else if(!($this -> getEmailCodCacheAndEmail('register')['email'] == $data['email'] &&
                   $this -> getEmailCodCacheAndEmail('register')['emailCode'] == $data['verify'])){ //检测输入的邮箱验证码是否正确
            $status = 3;
            $result = '邮箱和验证码不匹配！';
        }else if(UserInfoModel::getByEmail($data['email'])){    //检测邮箱是否被注册
            $status = 4;
            $result = '邮箱以被注册！';
        }else{  //向数据库中添加记录
            //向user_login表中添加记录
            $login = new LoginModel();
            $login -> data([
                'login_account' => $data['account'],
                'password' => md5($data['password1']),
                'create_ip' => $this -> getIp(),
                'is_active' => 1,
            ]);
            $login->save();
            //向user_info表中添加记录
            $user_info = UserInfoModel::create([
                'login_id'  =>  $login -> login_id,
                'email' => $data['email'],
                'real_name' => '无名氏',
                'picture' => '/default/picture.jpg',
            ]);

            //想缓存中存入注册信息以便用户直接登录使用
            Cache::set('login_account', $data['account']);
            Cache::set('password', md5($data['password1']));

            $status = 1;
            $result = '注册成功！';
        }
        //ajax返回数据
        return ['status'=>$status ,'message' =>$result, 'data' =>$data];
    }

    //发送邮箱验证码
    public function sendEmailCode(Request $request){
        $data = $request -> param();
        $status = 0;
        $result = '发送失败，请检查邮箱是否正确！';
        $flag = false;

        //收件人的邮箱
        $toemail = $data['email'];
        //邮箱标题
        $title = '交理云邮箱验证';
        //生成验证码
        $code = mt_rand(10000, 99999);
        if($data['status'] == 'login'){
            //将验证码存储在Cache中,并设置其有效时间为5分钟
            Cache::set('loginEmailCode', $code, 300);
            Cache::set('loginEmail', $toemail, 300);
        }
        if($data['status'] == 'register'){
            Cache::set('registerEmailCode', $code, 300);
            Cache::set('registerEmail', $toemail, 300);
        }
            //邮件内容
        $content1 = '你的邮箱正在进行注册账号操作，验证码为<h3>' . $code.'</h3><br />验证码五分钟内有效，请及时完成注册！';
        $content2 = '你的邮箱正在进行邮箱验证登陆操作，验证码为<h3>' . $code.'</h3><br />验证码五分钟内有效，请及时完成登录！';
        //发送邮件返回标识
        if($data['status'] == 'register')
            $flag = sendMail($toemail,$title,$content2);
        if($data['status'] == 'login')
            $flag = sendMail($toemail,$title,$content2);

        //根据发送结果修改返回信息
        if($flag === true){
            $status = 1;
            $result = '发送成功，请及时完成注册！';
        }

        //ajax返回数据
        return ['status'=>$status ,'message' => $result, 'data' => $data];
    }

    public function modifyServer(Request $request){
        $data = $request -> param();
        $status = 0;
        $result = '网络出错！';

        $user_info = Session::get('user_info');

        $user = (UserInfoModel::get($user_info['user_id']))->getData();

        if($user['real_name'] == $data['data']['name'] &&
           $user['user_age'] == (int)$data['data']['age'] &&
           $user['user_city'] == $data['data']['city'] &&
           $user['user_sex'] == (int)$data['data']['sex'] &&
           $user['introduction'] == $data['data']['comment']){
            $result = '请修改信息后再提交！';
        }else{
            $num = Db::table('user_info')->where('user_id', $user_info['user_id'])
                ->update([
                    'real_name' => $data['data']['name'],
                    'user_age' => (int)$data['data']['age'],
                    'user_city' => $data['data']['city'],
                    'user_sex' => (int)$data['data']['sex'],
                    'introduction' => $data['data']['comment'],
                ]);

            if(0 != $num){
                $status = 1;
                $result = '修改成功！';
                Session::set('user_info',(UserInfoModel::get($user_info['user_id']))->getData());
            }
        }

        return ['status'=>$status ,'message' => $result, 'data' => $data['data']];
    }

    public function modifyPasswordServer(Request $request){
        $data = $request -> param();
        $status = 0;
        $result = '网络出错！';

        $user_info = Session::get('user_info');
        $user = (UserInfoModel::get($user_info['user_id']))->getData();
        $login_id = $user['login_id'];
        $login_info = (LoginModel::get($login_id))->getData();
        if($login_info['password'] != md5($data['data']['oldpassword'])){
            $result = '原密码不对！';
        }else if($data['data']['newpassword'] != $data['data']['againpassword']){
            $result = '两次密码不一致！';
        }else{
            $num = Db::table('user_login')->where('login_id', $login_id)
                ->update([
                    'password' => md5((int)$data['data']['newpassword']),
                ]);
            if(0 != $num){
                $status = 1;
                $result = '修改成功！';
            }
        }

        return ['status'=>$status ,'message' => $result, 'data' => $data];
    }

    public function modifyPictureServer(Request $request){
        $data = $request -> param();
        $status = 0;
        $result = '网络出错！';

        $file = request()->file('file');

        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads'. DS .'picture');
            if($info){
                $path = '/uploads/picture/'.($info->getSaveName());
                $user_info = Session::get('user_info');
                $num = Db::table('user_info')->where('user_id', $user_info['user_id'])
                    ->update([
                        'picture' => $path,
                    ]);
                if(0 != $num){
                    $status = 1;
                    $result = '修改成功！';
                    Session::set('user_info',(UserInfoModel::get($user_info['user_id']))->getData());
                }
            }else{
                $result = '上传出错！';
            }
        }

        return ['status'=> $status,'message' => $result];
    }

    public function modifyDefaultPictureServer(Request $request){
        $data = $request -> param();
        $status = 0;
        $result = '网络出错！';

        $user_info = Session::get('user_info');

        $num = Db::table('user_info')->where('user_id', $user_info['user_id'])
            ->update([
                'picture' => $data['url'],
            ]);

        if(0 != $num){
            $status = 1;
            $result = '修改成功！';
            Session::set('user_info',(UserInfoModel::get($user_info['user_id']))->getData());
        }

        return ['status'=> $status,'message' => $result,'data' => $data];
    }

    //获取缓存中的邮箱验证码
    public function getEmailCodCacheAndEmail($purpose){
        $emailCode = Cache::get($purpose.'EmailCode');
        $email = Cache::get($purpose.'Email');
        return ['emailCode' => $emailCode,'email' => $email];
    }

    //        $name = '777.png';//图片名字
    //        $from = "D:\\top.webm";//文件存放路径
    //        $to = "D:\\";//生成图片存放路径
    //        $str = "Y:\\ffmpeg\bin\\ffmpeg -i " . $from . " -y -f mjpeg -ss 3 -t 1 " . $to . $name;//ffmpeg命令,具体啥意思可以百度
    ////        $str = "ipconfig";
    //        echo $str;
    //        exec($str, $output);//执行上述语句
    //        var_dump($output);


    //获取本机ip地址
    public function getIp() {
        $ip=false;
        if(!empty($_SERVER["HTTP_CLIENT_IP"])){
            $ip = $_SERVER["HTTP_CLIENT_IP"];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
            if($ip){
                array_unshift($ips, $ip); $ip = FALSE;
            }
            for($i = 0; $i < count($ips); $i++){
                if (!eregi ("^(10|172\.16|192\.168)\.", $ips[$i])){
                    $ip = $ips[$i];
                    break;
                }
            }
        }
        return($ip ? $ip : $_SERVER['REMOTE_ADDR']);
    }

    public function test(){
//        $login_id = LoginModel::where('login_account', 'admin') -> find();
//        echo $login_id;
//        $user_info = UserInfoModel::where('login_id', $login_id['login_id'])->find();
//        echo $user_info;
//        Session::set('user_info', $user_info);//user_info信息
//        $a = Session::get('user_info');
//        echo($a['login_id']);

//        $user_info = UserInfoModel::getByEmail('1615317800@qq.com');
//        echo $user_info;
//        $login_id = LoginModel::where('login_account', 'test1') -> find();
//        $login_id -> save([
//            'latest_login_datetime' => date("Y-m-d H:i:s",time()),
//            'latest_login_ip' => $this -> getIp(),
//        ],['login_id' => $login_id['login_id']]);
//        dump($login_id -> getData());
//        $a = ('true' == false);
//        echo $a;
//        dump(Session::get('user_info'));
//        dump(Session::get('directory'));
//        dump(Session::get('files'));
//        dump(Session::get('useSpace'));
//        dump(Session::get('useSpaceFormat'));



    }
}
