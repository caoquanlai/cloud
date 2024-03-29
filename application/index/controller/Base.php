<?php
namespace app\index\controller;
use app\index\model\Login as LoginModel;
use app\index\model\UserInfo as UserInfoModel;


use think\Controller;
use think\Session;
use think\Cookie;

class Base extends Controller
{
    protected function _initialize()    //初始化操作
    {
        parent::_initialize(); // TODO: Change the autogenerated stub
        define('USER_INFO', Session::get('user_info'));
    }

    //判断cookie是否有用户自动登录
    protected function isRememberLogin()
    {
        if (Cookie::has('account','user_') && Cookie::has('password','user_')){
            $account = Cookie::get('account', 'user_');
            $password = Cookie::get('password', 'user_');
            $login = new LoginModel();
            $login_info = $login -> where('login_account', $account) -> where('password', $password) -> find();
            if($login_info){
                $user = new UserInfoModel();
                $user_info = $user -> where('login_id', $login_info['login_id']) -> find();
                Session::set('user_info', $user_info);
                $this -> success('正在自动登录中......', 'http://cloud2.test/home');
            }
        }
    }


    //判断用户是否已经登陆，放在后台的入口，index/index
    protected function isLogin()
    {
        if (USER_INFO == NULL) {
            $this -> error('用户未登陆，请先登陆！', 'http://cloud2.test');
        }
    }

    //防止用户重复登陆  user/login
    protected function alreadyLogin()
    {
        if (USER_INFO != NULL) {
            $this -> error('用户已经登陆，请勿重复登陆！', 'http://cloud2.test/home');
        }
    }
}