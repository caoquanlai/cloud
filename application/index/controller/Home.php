<?php
namespace app\index\controller;

use ZipArchive;
use think\Db;
use app\index\model\Thumb;
use app\index\model\DirectoryInfo as DirectoryInfoModel;
use app\index\model\FileInfo as FileInfoModel;
use app\index\model\UserFile as UserFileModel;
use think\Request;
use think\Session;
use think\Image;

/**
 *                             _ooOoo_
 *                            o8888888o
 *                            88" . "88
 *                            (| -_- |)
 *                            O\  =  /O
 *                         ____/`---'\____
 *                       .'  \\|     |//  `.
 *                      /  \\|||  :  |||//  \
 *                     /  _||||| -:- |||||-  \
 *                     |   | \\\  -  /// |   |
 *                     | \_|  ''\---/''  |   |
 *                     \  .-\__  `-`  ___/-. /
 *                   ___`. .'  /--.--\  `. . __
 *                ."" '<  `.___\_<|>_/___.'  >'"".
 *               | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *               \  \ `-.   \_ __\ /__ _/   .-` /  /
 *          ======`-.____`-.___\_____/___.-`____.-'======
 *                             `=---='
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                     佛祖保佑        永无BUG
 *            佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 *
 * _ooOoo_
 * o8888888o
 * 88" . "88
 * (| -_- |)
 *  O\ = /O
 * ___/`---'\____
 * .   ' \\| |// `.
 * / \\||| : |||// \
 * / _||||| -:- |||||- \
 * | | \\\ - /// | |
 * | \_| ''\---/'' | |
 * \ .-\__ `-` ___/-. /
 * ___`. .' /--.--\ `. . __
 * ."" '< `.___\_<|>_/___.' >'"".
 * | | : `- \`.;`\ _ /`;.`/ - ` : | |
 * \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 * `=---='
 *.............................................
 *         佛曰：bug泛滥，我已瘫痪！
 */
class Home extends Base
{
    const DOWNLOAD_SIZE   = 10485760; //一次性可下载的文件总大小

    public function index()
    {
        $this -> isLogin(); //判断用户是否登陆
        $user_info = Session::get('user_info');

        $directory = $this -> getDirectory($user_info['user_id'],1);
        if($directory != null){
            foreach ($directory as $key=>$value){
                //添加目录大小和格式化目录大小字段
                $size = $this->getUseSpace($value['user_id'],$value['directory_id']);
                $directory[$key]['size'] = $size;
                $directory[$key]['sizeFormat'] = $this->SizeFormat($size);
            }
        }
//        Session::set('directory', $directory);
//        dump($directory);
        $files = $this -> getUserFiles($user_info['user_id'],1);
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
                $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                if(!(count($thumb_info) == 0 || $thumb_info == null)){
                    $files[$key]['thumb_info'] = $thumb_info[0];
                }
            }
        }
//        Session::set('files', $files);
//        dump($files);
        // 1为root目录的id
        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);
//        Session::set('useSpace', $useSpace);
//        Session::set('useSpaceFormat', $useSpaceFormat);

        $this->assign('user_info',$user_info);
        $this->assign('breadcrumb',$this->breadcrumb(1));
        $this->assign('directory',$directory);
        $this->assign('files',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }

    /**
     * 使home/folder/**********************的网址可以访问
     * @param Request $request
     * @return mixed 渲染界面
     */
    public function folder(Request $request){
        $data = $request->param();
        $base64_dir = substr($data['directory_id'],32);
        $directory_id = base64_decode($base64_dir);
        $user_info = Session::get('user_info');
        if($user_info == null || empty($user_info)){
            $this->error('用户还未登录，请先登录','/');
        }else{
            $user_id = $user_info['user_id'];
            $directory_info = Db::query("select * from directory_info where `user_id` = $user_id AND `directory_id` = $directory_id");
            if(count($directory_info) == 0 || $directory_info == null){
                $this->redirect('home');
            }else if(count($directory_info) == 1){
                //进行显示目录操作
                $directory = $this -> getDirectory($user_info['user_id'],$directory_id);
                if($directory != null){
                    foreach ($directory as $key=>$value){
                        //添加目录大小和格式化目录大小字段
                        $size = $this->getUseSpace($value['user_id'],$value['directory_id']);
                        $directory[$key]['size'] = $size;
                        $directory[$key]['sizeFormat'] = $this->SizeFormat($size);
                    }
                }
                $files = $this -> getUserFiles($user_info['user_id'],$directory_id);
                if($files != null){
                    //添加文件大小和格式化文件大小字段
                    foreach ($files as $key=>$value){
                        $file_id = $value['file_id'];
                        $size = $this->getFileSize($value['file_id']);
                        $files[$key]['size'] = $size;
                        $files[$key]['sizeFormat'] = $this->SizeFormat($size);
                        $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                        if(!(count($thumb_info) == 0 || $thumb_info == null)){
                            $files[$key]['thumb_info'] = $thumb_info[0];
                        }
                    }
                }
                $useSpace = $this->getUseSpace($user_info['user_id'],1);
                $useSpaceFormat = $this->SizeFormat($useSpace);

                $this->assign('user_info',$user_info);
                $this->assign('breadcrumb',$this->breadcrumb($directory_id));
                $this->assign('directory',$directory);
                $this->assign('files',$files);
                $this->assign('useSpace',$useSpace);
                $this->assign('useSpaceFormat',$useSpaceFormat);
                return $this->fetch('home/index');
            }
        }
        echo $directory_id;
    }

    /**
     * 打开目录操作，返回目录下的目录及文件
     * @param Request $request
     * @return array
     */
    public function openDirectory(Request $request){
        $data = $request -> param();
        $directory_id = $data['directory_id'];
        $user_info = Session::get('user_info');

//        $directory = $this->getDirectory($user_info['user_id'], $directory_id);
//        $files = $this->getUserFiles($user_info['user_id'], $directory_id);

        $directory = $this -> getDirectory($user_info['user_id'],$directory_id);
        if($directory != null){
            foreach ($directory as $key=>$value){
                //添加目录大小和格式化目录大小字段
                $size = $this->getUseSpace($value['user_id'],$value['directory_id']);
                $directory[$key]['size'] = $size;
                $directory[$key]['sizeFormat'] = $this->SizeFormat($size);
            }
        }
//        dump($directory);
        $files = $this -> getUserFiles($user_info['user_id'],$directory_id);
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($value['file_id']);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
                $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                if(!(count($thumb_info) == 0 || $thumb_info == null)){
                    $files[$key]['thumb_info'] = $thumb_info[0];
                }
            }
        }

        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);

        $data['directory'] = $directory;
        $data['files'] = $files;
        $data['breadcrumb'] = $this->breadcrumb($data['directory_id']);
        $data['useSpace'] = $useSpace;
        $data['useSpaceFormat'] = $useSpaceFormat;

        return ['status'=>1 , 'data' =>$data];
    }

    /**
     * 文档
     * @return mixed
     */
    public function doc(){
        $user_info = Session::get('user_info');
        $files = $this->getFileTypeList($user_info['user_id'],'document');
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
            }
        }

        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);
        $this->assign('files',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }
    /**
     * 图片
     * @return mixed
     */
    public function photo(){
        $user_info = Session::get('user_info');
        $files = $this->getFileTypeList($user_info['user_id'],'image');
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
                $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                if(!(count($thumb_info) == 0 || $thumb_info == null)){
                    $files[$key]['thumb_info'] = $thumb_info[0];
                }
            }
        }

        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);
        $this->assign('files',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }
    /**
     * 视频
     * @return mixed
     */
    public function video(){
        $user_info = Session::get('user_info');
        $files = $this->getFileTypeList($user_info['user_id'],'video');
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
            }
        }

        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);
        $this->assign('files',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }
    /**
     * 音频
     * @return mixed
     */
    public function audio(){
        $user_info = Session::get('user_info');
        $files = $this->getFileTypeList($user_info['user_id'],'audio');
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
            }
        }

        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);
        $this->assign('files',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }
    public function note(){
        return $this->fetch();
    }
    public function sharedir(){
        return $this->fetch();
    }
    public function safebox(){
        return $this->fetch();
    }
    public function share(){
        return $this->fetch();
    }
    /**
     * 回收站
     * @return mixed
     */
    public function recycle(){
        $user_info = Session::get('user_info');

        $files = $this -> getDeleteFile($user_info['user_id']);
        if($files != null){
            //添加文件大小和格式化文件大小字段
            foreach ($files as $key=>$value){
                $file_id = $value['file_id'];
                $size = $this->getFileSize($file_id);
                $files[$key]['size'] = $size;
                $files[$key]['sizeFormat'] = $this->SizeFormat($size);
                $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                if(!(count($thumb_info) == 0 || $thumb_info == null)){
                    $files[$key]['thumb_info'] = $thumb_info[0];
                }
            }
        }

        // 1为root目录的id
        $useSpace = $this->getUseSpace($user_info['user_id'],1);
        $useSpaceFormat = $this->SizeFormat($useSpace);

        $this->assign('deleteFiles',$files);
        $this->assign('useSpace',$useSpace);
        $this->assign('useSpaceFormat',$useSpaceFormat);
        return $this->fetch();
    }
    public function recent(){
        return $this->fetch();
    }

    public function upload(){
        return $this->fetch();
    }

    public function download(){
        return $this->fetch();
    }

    /**
     * 判断当前用户父目录id下是否已经有该文件id
     * @param $user_id int 用户id
     * @param $parent_id int 父目录id
     * @param $file_id int 文件id
     * @return bool
     */
    public function isDirectoryHasSameFile($user_id, $parent_id, $file_id){
        $result = Db::query("select * from user_file where user_id = ? AND parent_id = ? AND file_id = ? AND is_delete = 0",[$user_id,$parent_id,$file_id]);
        return (count($result) == 0) ? false : true;
    }

    /**
     * 上传之前检测文件是否存在服务器(伪上传)
     * @param Request $request
     * @return array
     * @throws \think\exception\DbException
     */
    public function befoerUploader(Request $request){
        $data = $request->param();
        $status = 0;
        $message = null;

        //判断file_info中是否已存在该md5值
        if($this->hasMd5($data['md5'])){
            $status =1;
        }

        if($status == 1){
            $user_ifo = Session::get('user_info');
            $file_info = FileInfoModel::getByFileMd5($data['md5']);
            if($this->isDirectoryHasSameFile($user_ifo['user_id'],$data['directory_id'],$file_info['file_id'])){
                $status = 2;
            }else{
                $user_file_id = $this->saveUserFile($user_ifo['user_id'],$file_info['file_id'],$data['file_name'],$data['directory_id']);
                if($user_file_id){
                    //file_info表中文件链接数加 1
                    FileInfoModel::update(['file_id' => $file_info['file_id'], 'file_link_num' => $file_info['file_link_num']+1]);
                    $message = (UserFileModel::get($user_file_id))->getData();
                    $message['size'] = $file_info['file_size'];
                    $message['sizeFormat'] = $this->SizeFormat($file_info['file_size']);
                }
                $file_id = $file_info['file_id'];
                $thumb_info = Db::query("select * from thumb where `file_id` = $file_id AND `thumb_width` < 60 and `thumb_height` < 60");
                if(!(count($thumb_info) == 0 || $thumb_info == null)){
                    $message['thumb_info'] = $thumb_info[0];
                }
            }
        }

        return ['status' => $status, 'data' => $data, 'message' => $message];
    }

    /**
     * 用户上传文件到服务器，并在数据库中记录
     * @param Request $request
     * @return array
     * @throws \think\exception\DbException
     */
    public function uploader(Request $request){
        // 获取表单上传文件 例如上传了001.jpg
        $data = $request->param();
        $file = request()->file('file');
        $user_info = Session::get('user_info');
        $directory_id = $data['directory_id'];
        $file_md5 = $data['file_md5'];
        $status = 0;
        $message = null;

        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads');
            if($info){
                $fileInfo = $file->getInfo();
                $path = '/uploads/'.str_ireplace('\\',"/",$info->getSaveName());
                if($FileId = $this->saveFile($file_md5,$fileInfo['size'],$fileInfo['name'],$path)){
                    if($UserFileId = $this->saveUserFile($user_info['user_id'],$FileId,$fileInfo['name'],$directory_id)){

                        $ext = $info->getExtension();
                        $image_type = ['jpg','png','jpeg','gif','bmp'];

                        $file_info = (FileInfoModel::get($FileId))->getData();
                        $user_file = (UserFileModel::get($UserFileId))->getData();
                        $array = $user_file;
                        $array['size'] = $file_info['file_size'];
                        $array['sizeFormat'] = $this->SizeFormat($file_info['file_size']);

                        if($file->checkImg() && in_array($ext, $image_type)){
                            //检查目录是否存在，不存在则创建
                            if(!is_dir('./uploads/thumb')){
                                mkdir('./uploads/thumb');
                            }
                            //生成缩略图
                            $image = Image::open('./uploads/'.$info->getSaveName());
                            $thumb_path = '/uploads/thumb/';
                            $thumb_name = $info->getFilename();
                            $thumb = $image->thumb(40,40,Image::THUMB_FILLED)->save('.'.$thumb_path.$thumb_name);
                            $message['thumb_info'] = (Thumb::create([
                                'file_id' => $FileId,
                                'thumb_name' => $thumb_name,
                                'thumb_width' => $thumb->width(),
                                'thumb_height' => $thumb->height(),
                                'thumb_size' => filesize('.'.$thumb_path.$thumb_name),
                                'thumb_path' => $thumb_path.$thumb_name,
                            ]))->getData();
                            $message = array_merge($message,$array);
                        }else{
                            $message = $array;
                        }
                        $status = 1;
                    }
                }
            }else{
                $message = $file->getError();
            }
        }
        return ['status' => $status,'message' => $message];
    }

    /**
     * 持久化user_file
     * @param int $user_id
     * @param int $file_id
     * @param string $file_name
     * @param int $parent_id
     * @return int 新增记录的id
     */
    public function saveUserFile($user_id, $file_id, $file_name, $parent_id){
        $file_type = str_ireplace(".","",strrchr($file_name,"."));
        $data = [
            'user_id'   => $user_id,
            'file_id'   => $file_id,
            'file_name' => $file_name,
            'file_type' => $file_type,
            'parent_id' => $parent_id,
        ];
        $userFile = UserFileModel::create($data);

        return $userFile->user_file_id;
    }

    /**
     * 持久化file
     * @param $fileMd5
     * @param $fileSize
     * @param $fileName
     * @param $path
     * @return int 新增记录的file_id
     */
    public function saveFile($fileMd5, $fileSize, $fileName, $path){
        $data = [
            'file_md5'   => $fileMd5,
            'file_size'   => $fileSize,
            'file_name' => $fileName,
            'path' => $path,
            //用户新上传的文件，链接数只有当前用户
            'file_link_num' => 1,
        ];
        $file = FileInfoModel::create($data);
//        dump($file->file_id);
        return $file->file_id;
    }



    public function downloader(){
        $fileName = 'SampleJPGImage30MB.jpg';
        $filePath = ROOT_PATH . 'public' . DS . 'uploads/picture/'.$fileName;//文件
        $fp=fopen($filePath,"r");

        //取得文件大小
        $fileSize=filesize($filePath);

        header("Content-type:application/octet-stream");//设定header头为下载
        header("Accept-Ranges:bytes");
        header("Accept-Length:".$fileSize);//响应大小
        header("Content-Disposition: attachment; filename=".$fileName);//文件名

        $buffer=1024;
        $bufferCount=0;

        while(!feof($fp)&&$fileSize-$bufferCount>0){//循环读取文件数据
            $data=fread($fp,$buffer);
            $bufferCount+=$buffer;
            echo $data;//输出文件
        }

        fclose($fp);
    }
    public function downloader1(Request $request){
//        $fileName = 'SampleJPGImage30MB.jpg';
        $data = $request -> param();
        $fileName = $data['name'];

        $filePath = ROOT_PATH . 'public' . DS . 'uploads/picture/'.$fileName;//文件
        $fp=fopen($filePath,"r");

        //取得文件大小
        $fileSize=filesize($filePath);

        header("Content-type:application/octet-stream");//设定header头为下载
        header("Accept-Ranges:bytes");
        header("Accept-Length:".$fileSize);//响应大小
        header("Content-Disposition: attachment; filename=".$fileName);//文件名
        ob_end_clean();//缓冲区结束
        ob_implicit_flush();//强制每当有输出的时候,即刻把输出发送到浏览器
        header('X-Accel-Buffering: no'); // 不缓冲数据
        $buffer=1024*1000;
        $bufferCount=0;

        while(!feof($fp)&&$fileSize-$bufferCount>0){//循环读取文件数据
            $data=fread($fp,$buffer);
            $bufferCount+=$buffer;
            echo $data;//输出文件
            sleep(1);
        }

        fclose($fp);
    }
    public function downloader2(){
        $fileName = 'test2.jpg';
        $filePath = ROOT_PATH . 'public' . DS . 'uploads/picture/'.$fileName;//文件
        $fp=fopen($filePath,"r");
        //取得文件大小
        $fileSize=filesize($filePath);
        $buffer=1024*100;
        $bufferCount=0;
        header("Content-type:application/octet-stream");//设定header头为下载
        header("Content-Disposition: attachment; filename=".$fileName);//文件名
        if (!empty($_SERVER['HTTP_RANGE'])){
            //explode('','')将字符串打散为数组
            $range = explode('-',substr($_SERVER['HTTP_RANGE'],6));
            fseek($fp,$range[0]);//移动文件指针到range上
            header('HTTP/1.1 206 Partial Content');
            header("Content-Range: bytes $range[0]-$fileSize/$fileSize");
            header("content-length:".$fileSize-$range[0]);
        }else{
            header("Accept-Length:".$fileSize);//响应大小
        }
        ob_end_clean();//缓冲区结束
        ob_implicit_flush();//强制每当有输出的时候,即刻把输出发送到浏览器
        header('X-Accel-Buffering: no'); // 不缓冲数据
        while(!feof($fp)&&$fileSize-$bufferCount>0){//循环读取文件数据
            $data=fread($fp,$buffer);
            $bufferCount+=$buffer;
            echo $data;//输出文件
            sleep(1);
        }
        fclose($fp);
    }
    public function downloader3($url, $type='en'){
        $url ='http://cloud2.test/uploads/temp/123.zip';
        if($type =='en'){
            return "thunder://".base64_encode("AA".$url."ZZ");
        }else{
            return substr(base64_decode(substr(trim($url),10)),2,-2);
        }
    }

    /**
     * 下载文件业务
     * @param Request $request
     * @return array
     * @throws \think\exception\DbException
     * @return
     */
    public function downloadServer(Request $request){
        $data = $request->param();
        $status = 0;
        $message = '';
        $user_info = Session::get('user_info');
        //目录总大小
        $directorySize = 0;
        //文件总大小
        $sumFileSize = 0;

        $checked = $data['checked'];    //二位数组，0 => [directory_id]，1 => [user_file_id]

        if(count($checked) == 0 || $checked == null){
            $message = '参数不正确';
        }else if(count($checked) == 1 || count($checked) == 2){
            if(!empty($checked[0])){
                foreach ($checked[0] as $item)  //directory_id
                    $directorySize += $this->getUseSpace($user_info['user_id'],$item);
            }
            if(!empty($checked[1])){
                foreach ($checked[1] as $item){ //user_file_id
                    $userFile = UserFileModel::get($item);
                    $file_id = $userFile['file_id'];
                    $sumFileSize += $this->getFileSize($file_id);
                }
            }
            $sum = $directorySize+$sumFileSize;

            if($sum == 0){
                $message = '请不要下载空白文件夹！';
            }else if($this::DOWNLOAD_SIZE < $sum){
                $message = '下载文件总大小不能超过10M！';
            }else if($this::DOWNLOAD_SIZE >= $sum){
                //进行打包操作，然后返回文件下载目录给前端，前端发送post请求进行下载
                //检查目录是否存在，不存在则创建
                if(!is_dir('./uploads/temp')){
                    mkdir('./uploads/temp');
                }
                $temp = md5(time());
                $zipName = './uploads/temp/'.$temp.'.zip';
                $zip=new ZipArchive();
                if($zip->open($zipName, ZipArchive::CREATE) === TRUE){
                    if(!empty($checked[0])){
                        foreach ($checked[0] as $item)  //directory_id
                            $this->addDirectoryToZip($zip, $user_info['user_id'],$item);
                    }
                    if(!empty($checked[1])){
                        foreach ($checked[1] as $item){ //user_file_id
                            $userFile = UserFileModel::get($item);
                            $file_id = $userFile['file_id'];
                            $file_info = FileInfoModel::get($file_id);
                            $file = ($file_info)->getData();
                            /*下面进行文件下载次数+1操作*/
                            $file_info::update(['file_id'=>$file_id, 'file_download_num' => $file['file_download_num']+1]);
                            $zip->addFile('.'.$file['path'],$userFile['file_name']);
                        }
                    }
                    $zip->close();
                }


                /*
                 * 进行文件下载次数+1操作
                 */

                $status = 1;
                $message = 'http://cloud2.test/uploads/temp/'.$temp.'.zip';
            }
        }

        return ['status' => $status,'message' => $message,'data' => $data,'filesize' => $sumFileSize, 'dir' => $directorySize];
    }

    /**
     * 面包屑路径
     * @param int $directory_id 目录id
     * @return array 不包含root目录
     */
    public function breadcrumb($directory_id){
        $breadcrumb = [];
        $user_info = Session::get('user_info');
        $sql = "SELECT `parent_id`,`directory_name` FROM directory_info WHERE directory_id = ";

        if($directory_id != 1){
            while(true){
                $parent_id = Db::query($sql.$directory_id);
                $parent_id[0]['directory_id'] = $directory_id;
                array_unshift($breadcrumb,$parent_id[0]);
                if($parent_id[0]['parent_id'] == 1)
                    break;
                $directory_id = $parent_id[0]['parent_id'];
            }
        }
        return $breadcrumb;
    }

    /**
     * 获取当前目录下的目录
     * @url http://cloud2.test/getDirectory?user_id=2&parent_id=1
     * @param int  $user_id   用户id
     * @param int  $parent_id 父目录id
     * @param int  $is_delete 是否是被删除的
     * @throws
     * @return array|null
     */
    public function getDirectory($user_id, $parent_id, $is_delete = 0){
        $directory = null;
        $directoryInfoList = DirectoryInfoModel::all([
            'user_id' => $user_id,
            'parent_id' => $parent_id,
            'is_delete' => $is_delete,
        ]);
        if(count($directoryInfoList)){
            $directory = [];
            foreach($directoryInfoList as $key => $value){
                array_push($directory, $value->getData());
            }
//            dump($directory);
        }
        return $directory;
    }

    /** 获取当前目录下的文件
     * @url http://cloud2.test/getFiles?user_id=2&parent_id=1
     * @param int  $user_id   用户id
     * @param int  $parent_id 父目录id
     * @param int  $is_delete 是否是被删除的
     * @throws
     * @return array|null
     */
    public function getUserFiles($user_id, $parent_id, $is_delete = 0){
        $files = null;
        $userFileList = UserFileModel::all([
            'user_id' => $user_id,
            'parent_id' => $parent_id,
            'is_delete' => $is_delete,
        ]);
        if(count($userFileList)){
            $files = [];
            foreach($userFileList as $key => $value){
                array_push($files, $value->getData());
            }
//            dump($files);
        }
        return $files;
    }

    /**
     * 获取用户回收站内所有的文件
     * @param int  $user_id  用户id
     * @throws
     * @return array|null
     */
    public function getDeleteFile($user_id){
        $deleteFile = null;
        $deleteFileList = UserFileModel::all([
            'user_id' => $user_id,
            'is_delete' => 1,
        ]);
        if(count($deleteFileList)){
            $deleteFile = [];
            foreach($deleteFileList as $key => $value){
                array_push($deleteFile, $value->getData());
            }
        }
//        dump($deleteFile);
        return $deleteFile;
    }

    /**
     * 清空回收站
     * @param Request $request
     * @return array
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function deleteAll(Request $request){
        $status = 0;
        $message = '网络出错！';
        $user_info = Session::get('user_info');

        $num = Db::table('user_file')->where('user_id',$user_info['user_id'])->where('is_delete', 1) -> delete();
        if(0 != $num){
            $status = 1;
            $message = '删除成功！';
        }

        return ['status' => $status, 'message' => $message];
    }

    /**
     * 还原回收站文件
     * @param Request $request
     * @return array
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function restore(Request $request){
        $data = $request->param();
        $status = 0;
        $message = '网络出错！';
        $user_info = Session::get('user_info');

        $checked = $data['checked'][1];
        $num = 0;

        foreach ($checked as $item){
            $temp = Db::table('user_file')->where('user_file_id',$item)
                ->update([
                    'is_delete' => 0,
                    'recovery_time' => date('Y-m-d H:i:s',time()),
                    'parent_id' => 1,
                ]);

            if(0 != $temp){
                /**
                 * 将文件链接数+1
                 */
                $user_file = UserFileModel::get($item);
                $file_id = $user_file['file_id'];
                $file_info = FileInfoModel::get($file_id);
                $file_info = FileInfoModel::update(['file_id' => $file_info['file_id'], 'file_link_num' => $file_info['file_link_num']+1]);
            }

            $num += $temp;
        }
        if($num == count($checked)){
            $status = 1;
            $message = '文件还原成功！';
        }

        return ['status' => $status, 'message' => $message,'data' => $checked];
    }

    /**
     * 永久删除文件
     * @param Request $request
     * @return array
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function deleteForever(Request $request){
        $data = $request->param();
        $status = 0;
        $message = '网络出错！';
        $user_info = Session::get('user_info');
        $checked = $data['checked'][1];
        $num = 0;

        foreach ($checked as $item){
            $temp = Db::table('user_file')->where('user_file_id',$item)-> delete();
            $num += $temp;
        }
        if($num == count($checked)){
            $status = 1;
            $message = '文件删除成功！';
        }

        return ['status' => $status, 'message' => $message,'data' => $checked];
    }

    /**
     * 根据文件类型获取所有文件列表
     * @param int   $user_id  用户id
     * @param String $file_type 文件类型(images,document,video,audio,notes)
     * @return array|null
     */
    public function getFileTypeList($user_id, $file_type){
        $fileList = null;
        $image = ['BMP','JPG','JPEG','PNG','GIF'];
        $document = ['TXT','DOC','DOCX','XLS','XLSX','PPT','PDF'];
        $video = ['AVI','MKV','MOV','MP4','TS','RMVB','FLV','WMV','RMVB','RM','WM','WEBM'];
        $audio = ['CDA','WAV','MP3','WMA','RA','MIDI','OGG','APE','FLAC','AAC'];

        $type = null;
        $sqlBody = "";

        if(strcasecmp($file_type,'image')==0){
            $type = $image;
        }else if(strcasecmp($file_type,'document')==0){
            $type = $document;
        }else if(strcasecmp($file_type,'video')==0){
            $type = $video;
        }else if(strcasecmp($file_type,'audio')==0){
            $type = $audio;
        }else{
            return null;
        }
        for($i=0; $i<count($type)-1; $i++){
            $sqlBody .= "`file_type` = '".$type[$i]."' OR ";
        }
        $sqlBody .= "`file_type` = '".$type[count($type)-1]."'";

        $sql = "SELECT * FROM `user_file` WHERE  (  `user_id` = ".$user_id." AND `is_delete` = 0 AND ( ".$sqlBody." ) )";

        $fileList = Db::query($sql);
        return $fileList;
    }

    /**
     * 获取文件大小(单位B)
     * @url http://cloud2.test/getFileSize?user_id=2&parent_id=1
     * @param int $file_id  文件id
     * @throws
     * @return int|0
     */
    public function getFileSize($file_id){
        $size = 0;
        $file = FileInfoModel::get($file_id);
        if($file){
            $size = $file['file_size'];
        }
        return $size;
    }

    /**
     * 文件大小格式化
     * @param int $byte 字节数
     * @return string
     */
    public function SizeFormat($byte){
        $size = $byte.'B';
        if(1024 <= $byte && $byte < 1024*1024)
            $size = round(($byte/1024), 2).'KB';
        if(1024*1024 <= $byte && $byte < 1024*1024*1024)
            $size = round($byte/(1024*1024), 2).'MB';
        if(1024*1024*1024 <= $byte && $byte < 1024*1024*1024*1024)
            $size = round($byte/(1024*1024*1024), 2).'GB';
        return $size;
    }

    /**
     * 递归获取当前父目录及子目录的使用空间（单位B）
     * @url http://cloud2.test/getUseSpace?file_id=7
     * @param int $user_id   用户id
     * @param int $parent_id 父目录id
     * @return int|0
     */
    public function getUseSpace($user_id, $parent_id){
        $useSpace = 0;   //使用空间

        //统建当前目录下文件的大小总量
        $file = $this->getUserFiles($user_id, $parent_id);
        //判断当前目录下是否存在文件
        if(($file!=null) && count($file)){
            //遍历文件，统计文件总量
            foreach($file as $key => $value){
                $file_id = $value['file_id'];
                $useSpace += $this->getFileSize($file_id);
            }
        }
        //获取当前目录的一级子目录
        $directory = $this->getDirectory($user_id, $parent_id);

        //判断子目录是否存在
        if(($directory!=null) && count($directory)){
            //循环遍历子目录，递归
            foreach($directory as $key => $value){
                $useSpace += $this->getUseSpace($user_id, $value['directory_id']);
            }
        }
        return $useSpace;
    }

    /**
     * file_info表中是否存在该md5值
     * @param string $md5 比对的md5值
     * @return boolean true：有 false：无
     */
    public function hasMd5($md5){
        $flag = false;
        if(strlen($md5) == 32){
            $sql = "SELECT `file_id`,`file_md5` FROM file_info WHERE `file_md5` = '$md5'";
            $file = Db::query($sql);
//            dump($file);
            if($file)
                $flag = true;
        }
        return $flag;
    }

    /**
     * 该父目录下是否有同样的名字的目录
     * @param int  $user_id 用户id
     * @param int $parent_id 父目录id
     * @param string $directory_name 目录名称
     * @return bool
     */
    public function hasDirectoryName($user_id,$parent_id,$directory_name){
        $flag = false;
        $sql = "SELECT `directory_name` FROM directory_info WHERE `user_id` = $user_id AND `parent_id` = $parent_id AND `is_delete` = 0";
        $nameArray = Db::query($sql);
        if(count($nameArray)){
            foreach ($nameArray as $key => $value){
                if($value['directory_name'] == $directory_name)
                    $flag = true;
            }
        }
        return $flag;
    }

    /**
     * 在当前目录下新建目录
     * @param int $user_id 用户id
     * @param int $parent_id 当前目录id
     * @param String $directoryName 新建目录名
     * @throws
     * @return int|null
     */
    public function createDirectory($user_id, $parent_id, $directoryName){
        $directory_id = null;
        if(!$this->hasDirectoryName($user_id,$parent_id,$directoryName)){
            $directory_depth = ((DirectoryInfoModel::get($parent_id))->getData())['directory_depth'];
            $data = [
                'user_id' => $user_id,
                'parent_id' => $parent_id,
                'directory_name' => $directoryName,
                'directory_depth' => $directory_depth+1,
                'is_delete' => 0,
            ];
            $directory_id = (DirectoryInfoModel::create($data))['directory_id'];
        }
        return $directory_id;
    }

    /**
     * 响应前端新建目录业务
     * @param Request $request
     * @return array
     * @throws \think\exception\DbException
     */
    public function createDirectoryServer(Request $request){
        $data = $request -> param();    //前端发送的参数
        $status = 0;    //操作标示
        $message = null;    //数据信息或提示信息
        $user_info = Session::get('user_info');
        $directory_id = $this->createDirectory($user_info['user_id'], $data['parent_id'], $data['directory_name']);
        if($directory_id != null){
            $status = 1;
            $message = (DirectoryInfoModel::get($directory_id))->getData();
            $message['size'] = 0;
            $message['sizeFormat'] = '0B';
        }else{
            $message = '目录名相同！';
        }
        return ['status' => $status, 'message' => $message, 'data' => $data];
    }

    /**
     * 删除用户-文件链接，将文件标记为已删除
     * @param $user_file_id user_file表的主键
     * @throws \think\exception\DbException
     */
    public function deleteFile($user_file_id){
        $user_file = UserFileModel::get($user_file_id);

        $file_id = $user_file['file_id'];
        $file_info = FileInfoModel::get($file_id);

        $user_file = UserFileModel::update(['user_file_id' => $user_file_id,'is_delete' => 1,'delete_time' => date('Y-m-d H:i:s',time())]);
        $file_info = FileInfoModel::update(['file_id' => $file_info['file_id'], 'file_link_num' => $file_info['file_link_num']-1]);
    }

    /**
     * 删除目录及子目录
     * @param $directory_id
     * @throws \think\exception\DbException
     */
    public function deleteDirectory($directory_id){
        $user_info = Session::get('user_info');

        //获取到当前目录下的文件和目录
        $files = $this->getUserFiles($user_info['user_id'],$directory_id);
        $directory = $this->getDirectory($user_info['user_id'],$directory_id);

        //删除当前目录
        DirectoryInfoModel::update(['directory_id' => $directory_id,'is_delete' => 1, 'delete_time' => date('Y-m-d H:i:s',time())]);

        //删除当前目录中的文件
        if(($files!=null) && count($files)){
            foreach($files as $key => $value){
                $this->deleteFile($value['user_file_id']);
            }
        }

        //判断子目录是否存在
        if(($directory!=null) && count($directory)){
            //循环遍历子目录，递归
            foreach($directory as $key => $value){
                $this->deleteDirectory($value['directory_id']);
            }
        }
    }

    /**
     * 响应前端删除文件（夹）操作
     * @param Request $request
     * @return array
     * @throws \think\exception\DbException
     */
    public function deleteServer(Request $request){
        $data = $request->param();
        $status = 0;
        $message = null;

        $checked = $data['checked'];
        if(count($checked) == 0 || $checked == null){
            $message = '参数不正确';
        }else if(count($checked) == 1 || count($checked) == 2){
            if(!empty($checked[0])){
                foreach ($checked[0] as $item)
                    $this->deleteDirectory($item);
            }
//
            if(!empty($checked[1])){
                foreach ($checked[1] as $item)
                    $this->deleteFile($item);
            }
            $status = 1;
            $message = '删除成功！';
        }

        return ['status' => $status, 'message' => $message, 'data' => $data, 'test' => empty($checked[0])];
    }


    public function test()
    {
        $user_info = Db::table('user_info')
            ->where('user_id', 28)
            ->update([
                'real_name' => '123',
                'user_age' => 23,
                'user_city' => '123',
                'user_sex' => 1,
                'introduction' => '123123',
            ]);
        dump($user_info);
        echo ($user_info == null);
    }


    /**
     * 将目录及子目录递归的压缩到zip中
     * @param ZipArchive $zip
     * @param int $user_id
     * @param int $dir_id
     * @param string $path
     * @throws \think\exception\DbException
     */
    public function addDirectoryToZip(ZipArchive $zip, $user_id, $dir_id, $path=''){
        $path .= (DirectoryInfoModel::get($dir_id))['directory_name'].'/';

        //压缩当前目录下的文件
        $user_file = $this->getUserFiles($user_id, $dir_id);
        //判断当前目录下是否存在文件
        if(($user_file!=null) && count($user_file)){
            //遍历文件，统计文件总量
            foreach($user_file as $key => $value){
                $file_id = $value['file_id'];
                $file_info = FileInfoModel::get($file_id);
                $file = ($file_info)->getData();
                /*下面进行文件下载次数+1操作*/
                $file_info::update(['file_id'=>$file_id, 'file_download_num' => $file['file_download_num']+1]);
                $zip->addFile('.'.$file['path'],$path.$value['file_name']);
            }
        }

        //获取当前目录的一级子目录
        $dir_array = $this->getDirectory($user_id,$dir_id);

        //判断子目录是否存在
        if(($dir_array!=null) && count($dir_array)){
            //循环遍历子目录，递归
            foreach($dir_array as $key => $value){
                $this->addDirectoryToZip($zip, $user_id, $value['directory_id'], $path);
            }
        }

    }

    public function getPhotoInfo(Request $request){
        $status = 0;
        $message = '请求出错！';
        $data = $request->param();

        $info = null;
        $info = (FileInfoModel::get($data['file_id']))->getData();

        if(null != $info){
            $status = 1;
            $message = '请求成功！';
        }

        return ['status' => $status,'message' => $message,'data' => $info];
    }


    public function hasAndReplaceFileName($file_name, $file_name_array){
        $new_file_name = '';

        return $new_file_name;
    }


}