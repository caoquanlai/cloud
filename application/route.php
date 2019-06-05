<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Route;
//return [
////    '__pattern__' => [
////        'name' => '\w+',
////    ],
////    '[hello]'     => [
////        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
////        ':name' => ['index/hello', ['method' => 'post']],
////    ],
////
////];

//登录主页
Route::rule('/','index/index/index');

//交理云协议
Route::rule('server','index/index/server');

//忘记密码
Route::rule('forget','index/index/forget');

//发送邮箱验证码
Route::rule('sendEmailCode','index/index/sendEmailCode');

//测试代码
Route::rule('test','index/home/test');
Route::rule('upload','index/home/upload');
Route::rule('download','index/home/download');
Route::rule('downloader','index/home/downloader');
Route::rule('downloader1','index/home/downloader1');
Route::rule('downloader2','index/home/downloader2');
Route::rule('downloader3','index/home/downloader3');
Route::rule('getDirectory','index/home/getDirectory');
Route::rule('getUserFiles','index/home/getUserFiles');
Route::rule('getDeleteFile','index/home/getDeleteFile');
Route::rule('getFileTypeList','index/home/getFileTypeList');
Route::rule('getUseSpace','index/home/getUseSpace');
Route::rule('getFileSize','index/home/getFileSize');






//退出登录
Route::rule('logout','index/index/logout');
//账号密码登录
Route::rule('accountLoginCheck','index/index/accountLoginCheck');
//邮箱验证登录
Route::rule('emailLoginCheck','index/index/emailLoginCheck');
//注册登录
Route::rule('registerLogin','index/index/registerLogin');

//注册
Route::rule('register','index/index/register');
//修改
Route::rule('modify','index/index/modify');
Route::rule('modifyServer','index/index/modifyServer');
Route::rule('modifyPasswordServer','index/index/modifyPasswordServer');
Route::rule('modifyPictureServer','index/index/modifyPictureServer');
Route::rule('modifyDefaultPictureServer','index/index/modifyDefaultPictureServer');





Route::rule('befoerUploader','index/home/befoerUploader');
Route::rule('uploader','index/home/uploader');


Route::rule('home/downloadServer','index/home/downloadServer');


Route::rule('home/createDirectory','index/home/createDirectory');
Route::rule('home/createDirectoryServer','index/home/createDirectoryServer');

Route::rule('home/deleteServer','index/home/deleteServer');
Route::rule('home/deleteAll','index/home/deleteAll');
Route::rule('home/restore','index/home/restore');
Route::rule('home/deleteForever','index/home/deleteForever');
Route::rule('home/getPhotoInfo','index/home/getPhotoInfo');

Route::rule('home/openDirectory','index/home/openDirectory'   );

Route::rule('home/folder/:directory_id','index/home/folder'   );

//用户主页
Route::rule('home',         'index/home/index'   );
Route::rule('home/doc',     'index/home/doc'     );
Route::rule('home/photo',   'index/home/photo'   );
Route::rule('home/video',   'index/home/video'   );
Route::rule('home/audio',   'index/home/audio'   );
Route::rule('home/note',    'index/home/note'    );
Route::rule('home/sharedir','index/home/sharedir');
Route::rule('home/safebox', 'index/home/safebox' );
Route::rule('home/share',   'index/home/share'   );
Route::rule('home/recycle', 'index/home/recycle' );
Route::rule('home/recent',  'index/home/recent'  );