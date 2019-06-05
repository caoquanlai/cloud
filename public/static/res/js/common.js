// 公共方法
/**
 * 统计文件夹及文件总数，替换显示
 */
function itemNum(){
    var num = $('#table tbody tr').length;
    $('#table caption').text("共"+num+"项");

}
function useSpace() {
    var temp = 0;
    $('#table tbody tr').each(function () {
        temp += parseInt($(this).children('td').eq(3).attr('data-size'));
    });
    temp = SizeFormat(temp);
    console.log(temp);
    $('#p-capacity span span').text(temp);
}

/**
 * 该部分代码实现动态添加多选框
 */
function addCheckbox() {
    var $tbr = $('#table tbody tr');
    var $checkItemTd = $('<td><span class="iconfont icon-duoxuankuang1 my-check"></span></td>');
    $tbr.prepend($checkItemTd);
}
/**
 * 该部分代码实现动态添加多选框
 */
function removeCheckbox() {
    $('#table tbody tr').each(function () {
        $(this).find('td').eq(0).remove();
        // console.log($(this).find('td').eq(0));
        // $(this).remove();
    });
}
function removemyCheckbox() {
    var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
    $tbr.find('.my-check').off('click');
    $tbr.find('.my-check').parent().parent().off('click');
}
/**
 * 该部分代码实现单行多选框的功能，并且当所有的多选框被选中的时候，总选框也会被选中
 */
function myCheckbox() {
    var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
    $tbr.find('.my-check').on('click',function () {
        colorCheck($(this));
        topCheck();
        console.log('子点击');
        event.stopPropagation();
    });
    $tbr.find('.my-check').parent().parent().on('click',function () {
        $(this).find('.my-check').click(colorCheck($(this).find('.my-check')));
        $(this).find('.my-check').click(topCheck());
        console.log('父点击');
    });
}
/**
 * 该部分代码为点击变色算法，供其他事件调用
 */
function colorCheck(this1) {
    var $thr = $('#table thead tr');
    var $tb = $('#table tbody');
    var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
    var $tbrall = $('#table tbody tr');
    var $checkAll = $thr.find('.num-check');
    /*以下if/else用于多选框的data-ischeck属性设置与单行的颜色调整*/
    if (this1.attr("data-ischeck")) {
        this1.attr("data-ischeck","");
        this1.parent().parent().removeClass('bg-checkblue');
        this1.parent().parent().find("a").removeClass('bg-checkblue');
        this1.parent().parent().find(".icon-wenjianjia").removeClass('color-ssblue');
        this1.parent().parent().find(".icon-wenjianjia").addClass('color-sblue');
        this1.removeClass('icon-fuxuankuang11');
        this1.addClass('icon-duoxuankuang1');
    } else {
        this1.attr("data-ischeck","check");
        this1.parent().parent().addClass('bg-checkblue');
        this1.parent().parent().find("a").addClass('bg-checkblue');
        this1.parent().parent().find(".icon-wenjianjia").removeClass('color-sblue');
        this1.parent().parent().find(".icon-wenjianjia").addClass('color-ssblue');
        this1.addClass('icon-fuxuankuang11');
        this1.removeClass('icon-duoxuankuang1');
    }
    /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
    if($tbrall.find('.icon-fuxuankuang11').length == $tbrall.length){
        if ($checkAll.hasClass('icon-duoxuankuang1')){
            $checkAll.removeClass('icon-duoxuankuang1');
            $checkAll.addClass('icon-check-all');
        }
        $checkAll.attr("data-ischeck","check");
    }else {
        if ($checkAll.hasClass('icon-check-all')){
            $checkAll.removeClass('icon-check-all');
            $checkAll.addClass('icon-duoxuankuang1');
        }
        $checkAll.attr("data-ischeck","");
    }
}
/**
 * 该部分代码实现顶端导航栏的动态显示
 */
function topCheck() {
    var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
    if($tbr.find('.icon-fuxuankuang11').length!=0){
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
        $("#b-down").show();
    }else {
        $("#b-down").hide();
        if ($("#p-lately").hasClass("color-blue")) {
            $("#b-upload").show();
            $("#b-new").show();
        }
        if ($("#p-whole").hasClass("color-blue")) {
            $("#b-upload").show();
            $("#b-new").show();
        }
        if ($("#p-file").hasClass("color-blue")) {
            // $("#b-upload").show();
        }
        if ($("#p-picture").hasClass("color-blue")) {
            // $("#b-upload").show();
        }
        if ($("#p-video").hasClass("color-blue")) {
            // $("#b-upload").show();
        }
        if ($("#p-music").hasClass("color-blue")) {
            // $("#b-upload").show();
        }
        if ($("#p-note").hasClass("color-blue")) {
            $("#b-note").show();
        }
        if ($("#p-share").hasClass("color-blue")) {
            $("#b-share").show();
        }
    }
}

/**
 * 该部分代码的功能是返回当前被选中的文件/文件夹
 * 并且将所选中的文件的data-userfileid与文件夹的data-directoryid
 * 该函数无输入，有返回值
 * @param Array $checkDirefileid  二维数组，包含目录的ID与文件的ID
 */
function getCheckdirefileid(){
    var $checkDirefileid = new Array();
    $checkDirefileid[0] = new Array();  //该数组存储directoryid
    $checkDirefileid[1] = new Array();  //该数组存储userfileid
    var check =$('#table tbody tr').find('.my-check');
    check.each(function () {
        if ($(this).attr('data-ischeck')){
            if ($(this).parent().parent().attr('data-directoryid'))
                $checkDirefileid[0].push($(this).parent().parent().attr('data-directoryid'));
            if ($(this).parent().parent().attr('data-userfileid'))
                $checkDirefileid[1].push($(this).parent().parent().attr('data-userfileid'));
        }
    });
    return $checkDirefileid;
}


// 验证码点击事件——刷新验证码
$("#verify_img").click(function () {
    var ts = Date.parse(new Date());	//1000
    $(this).attr("src" , "/captcha?id="+ts)
});

//封装ajax操作
//data——请求发送的数据  url——请求的地址
//callback——ajax成功的回调函数  failCallback——ajax失败的回调函数
function ajax(data, url, callback, failCallback) {
    console.log("common.js 封装的ajax提交表单");
    $.ajax({
        type: 'POST',
        url: url ,
        data: data ,
        dataType: "json",
        success: function(data){
            callback(data);
        },
        error:function(data){
            failCallback(data);
        }
    });
    console.log('---------common.js-------------');
}

//将serializeArray返回的表单数据转为json
function serializeArrayToJson(serializeArray){
    var serializeJson={};
    $(serializeArray).each(function(){
        if(serializeJson[this.name]){
            if($.isArray(serializeJson[this.name])){
                serializeJson[this.name].push(this.value);
            }else{
                serializeJson[this.name]=[serializeJson[this.name],this.value];
            }
        }else{
            serializeJson[this.name]=this.value;
        }
    });
    return serializeJson;
}

//正则判断字符串是否为邮箱
var isEmail = function (val) {
    var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var domains= ["qq.com","163.com","vip.163.com","263.net","yeah.net","sohu.com","sina.cn","sina.com","eyou.com","gmail.com","hotmail.com","42du.cn"];
    if(pattern.test(val)) {
        var domain = val.substring(val.indexOf("@")+1);
        for(var i = 0; i< domains.length; i++) {
            if(domain == domains[i]) {
                return true;
            }
        }
    }
    return false;
}


/**
 *
 * @param byte 字节数
 * @returns {string}
 * @constructor
 */
function SizeFormat(byte){
    var size = byte+'B';
    if(1024 <= byte && byte < 1024*1024)
        size = (byte/1024).toFixed(2)+'KB';
    if(1024*1024 <= byte && byte < 1024*1024*1024)
        size = (byte/(1024*1024)).toFixed(2)+'MB';
    if(1024*1024*1024 <= byte && byte < 1024*1024*1024*1024)
        size = (byte/(1024*1024*1024)).toFixed(2)+'GB';
    return size;
}

//iconfont中有的文件图标
var file_type = ['gif','png','jpg','bmp','txt','wps','xsl','ppt','pdf','html','doc','tar','zip',
    'rar','7z','','tif','rp','swf','svg','psd','exe','eps','avi','ai','mp3','mp4','mov','flv'];