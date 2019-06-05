$(document).ready(function(){
    /**
     * 上传界面 - 和头部空白的点击时间
     */
    $('#upload_view_header,#suoxiao').on('click', function () {
        size = document.getElementById('suoxiao');
        if($('#upload_view_body').css('height') != '0px'){
            $('#upload_view').animate({height:'40px'});
            $('#upload_view_body').animate({height:'0px'});
            size.href.baseVal = '#icon-shouqi';
        } else{
            $('#upload_view').animate({height:'422px'});
            $('#upload_view_body').animate({height:'400px'});
            size.href.baseVal = '#icon-suoxiao';
        }
    });

    /**
     * 上传界面 X 的点击事件
     */
    $('#cha').parent().on('click',function (e) {
        e.stopPropagation();//阻止事件冒泡即可
        $('#upload_view').css('display', 'none');
    });

    /**
     * 设置进度条进度
     * @param id
     * @param num
     */
    function setProgress(id, num){
        $('#'+id).css('width',num+'%');
        $('#'+id).text(num+'%');
    }

    /**
     * 获取文件的后缀
     * @param name
     * @returns {string}
     */
    function getSuffix(name){
        var sum = name.lastIndexOf(".");
        var suffix=name.substring(sum+1,name.length);
        return suffix;
    }


    /**
     * 文件上传请求函数
     * @param index 显示的下表
     * @param file
     */
    function fileUpload(index, file){
        console.log(file.name);
        var formData = new FormData();
        formData.append('file',file);
        var dir_id = $('#breadcrumb span').attr('data-dirid');
        formData.append('directory_id',dir_id);
        console.log('目录ID：'+dir_id);
        console.log(formData.get('file'));
        console.log(formData.get('directory_id'));

        console.log("************ spark md5 **************");

        getFileMd5(file,function (md5) {
            console.log(md5);
            console.log('上传函数');
            formData.append('file_md5',md5);
            console.log(formData.get('file_md5'));
            $.post('http://cloud2.test/befoerUploader', {md5: md5,file_name:file.name,directory_id:dir_id}, function (data, status) {
                // console.log(status);
                if(data.status === 0){
                    $.ajax({
                        type: 'post',
                        url: "http://cloud2.test/uploader",
                        data: formData,
                        async: true,
                        cache: false,
                        processData: false,
                        contentType: false,
                        xhr: function () {  //获取上传进度
                            myXhr = $.ajaxSettings.xhr();
                            if (myXhr.upload) {
                                myXhr.upload.addEventListener('progress', function (e) {
                                    console.log('--------------------xhr---------------------------');
                                    console.log(e);
                                    var loaded = e.loaded;//已上传
                                    console.log(loaded);
                                    var total = e.total;//总大小
                                    console.log(total);
                                    var percent = Math.floor(100 * loaded / total);
                                    console.log(percent);
                                    console.log(index);
                                    setProgress('upload_'+index,percent);
                                    console.log('--------------------xhr end---------------------------');
                                });
                                return myXhr;
                            }
                        },
                        success: function (message) {
                            console.log('--------------------真上传--------------------------');
                            console.log(message.message);
                            if(message.status === 1){
                                removeCheckbox();
                                // 添加数据到界面
                                var temp = '<span class="icon iconfont icon-tubiao-unknown color-sblue file-icon-size"></span>';
                                //如果有后缀在iconfont库中的文件，则修改样式为对应的iconfont样式
                                if(file_type.indexOf(message.message["file_type"]) > -1){
                                    //如果后缀为可显示缩略图的，则显示缩略图
                                    if((message.message['thumb_info']) && (message.message["file_type"] == 'jpg' || message.message["file_type"] == 'png' || message.message["file_type"] == 'gif' || message.message["file_type"] == 'bmp')){
                                        temp = '<img src="'+message.message['thumb_info']['thumb_path']+'" class="img-thumbnail" style="width: 40px;height: 40px;padding: 0.1rem;" alt="加载失败">';
                                    }else{
                                        temp = '<span class="icon iconfont icon-tubiao-'+message.message['file_type']+' color-sblue file-icon-size"></span>';
                                    }
                                }
                                $('#table tbody').append('<tr class="tr-file" data-userFileId="'+message.message["user_file_id"]+'">\n' +
                                    '            <td>\n' +
                                    '                <div></div>\n' +
                                    '                '+temp+'\n' +
                                    '                <a href="javascript:void(0)" class="file" data-fileid="'+message.message["file_id"]+'" id='+message.message["user_file_id"]+'><span>'+message.message['file_name']+'</span></a>\n' +
                                    '                <span class="badge badge-secondary badge-success">New</span>' +
                                    '            </td>\n' +
                                    '            <td>'+message.message["user_file_create"]+'</td>\n' +
                                    '            <td data-size="'+message.message["size"]+'">'+message.message["sizeFormat"]+'</td>\n' +
                                    '        </tr>');
                                addCheckbox();
                                removemyCheckbox();
                                myCheckbox();
                                itemNum();
                                useSpace();
                            }
                            console.log('--------------------真上传 end---------------------------');
                        },
                        error: function (data) {
                            console.log('--------------------error---------------------------');
                            console.log(data);
                            console.log(data.message);
                            console.log('--------------------error end---------------------------');
                        }
                    });
                }else if(data.status === 1){
                    console.log('--------------------伪上传---------------------------');
                    console.log(data.message);
                    //伪上传速度
                    var speed = 1024*1024*100;
                    var timetemp = 0;
                    var progress = 0;
                    console.log(progress);

                    var temp = '<span class="icon iconfont icon-tubiao-unknown color-sblue file-icon-size"></span>';
                    //如果有后缀在iconfont库中的文件，则修改样式为对应的iconfont样式
                    if(file_type.indexOf(data.message["file_type"]) > -1){
                        //如果后缀为可显示缩略图的，则显示缩略图
                        if((data.message['thumb_info']) && (data.message["file_type"] == 'jpg' || data.message["file_type"] == 'png' || data.message["file_type"] == 'gif' || data.message["file_type"] == 'bmp')){
                            temp = '<img src="'+data.message['thumb_info']['thumb_path']+'" class="img-thumbnail" style="width: 40px;height: 40px;padding: 0.1rem;" alt="加载失败">';
                        }else{
                            temp = '<span class="icon iconfont icon-tubiao-'+data.message['file_type']+' color-sblue file-icon-size"></span>';
                        }
                    }

                    var interval = setInterval(function(){
                        if(progress >= 100){
                            setProgress('upload_'+index,100);
                            clearInterval(interval);
                            // 添加数据到界面
                            removeCheckbox();
                            $('#table tbody').append('<tr class="tr-file" data-userFileId="'+data.message["user_file_id"]+'">\n' +
                                '            <td>\n' +
                                '                <div></div>\n' +
                                '                '+temp+'\n' +
                                '                <a href="javascript:void(0)" class="file" data-fileid="'+data.message["file_id"]+'" id='+data.message["user_file_id"]+'><span>'+data.message['file_name']+'</span></a>\n' +
                                '                <span class="badge badge-secondary badge-success">New</span>' +
                                '            </td>\n' +
                                '            <td>'+data.message["user_file_create"]+'</td>\n' +
                                '            <td data-size="'+data.message["size"]+'">'+data.message["sizeFormat"]+'</td>\n' +
                                '        </tr>');
                            addCheckbox();
                            removemyCheckbox();
                            myCheckbox();
                            itemNum();
                            useSpace();
                        }else{
                            setProgress('upload_'+index,progress.toFixed(0));
                            timetemp+=speed;
                            progress=(timetemp/file.size)*100;
                            console.log(timetemp);
                            console.log(progress.toFixed(0));
                        }
                    },100);
                    console.log('--------------------伪上传 end---------------------------');
                }else if(data.status === 2){
                    $('#upload_'+index).css('width','100%');
                    $('#upload_'+index).text('文件已存在');
                }
                //调用home/test.js中的函数
            },'json');
            console.log('上传函数end');
        });


        console.log("************ spark md5 **************");


    }


    /**
     * 文件上传按钮点击事件
     */
    $('#upload_button').on('click',function () {
        $("#file").trigger("click");
        $('#file').on('change',function () {    //当file的内容发生改变时会触发两次change事件，如果想要只触发一次，就需要重置file
            $('#upload_view').css('display', '');
            console.log('*********************');
            var trNum = $('.tr_upload').length;
            console.log(trNum);
            var length = $('#file')[0].files.length;
            console.log(length);
            console.log('*********************');
            // 根据多选的文件，循环发送ajax请求
            for(var index=0 ;index<length;index++){
                console.log('-------------------------------------------------');
                var file = document.getElementById('file').files[index];
                console.log(file.size);
                console.log(file.type);
                var name = file.name;
                console.log(name);
                console.log(getSuffix(name));
                var size = file.size;
                console.log(SizeFormat(size));
                var temp = 'unknown';
                if(file_type.indexOf(getSuffix(name)) > -1){
                    temp = getSuffix(name);
                }
                var dir = $('#breadcrumb span').text();
                $('#upload_table tbody').prepend('<tr class="tr_upload">\n' +
                    '                <td>\n' +
                    '                    <div>\n' +
                    '                        <svg class="c_icon" aria-hidden="true"><use xlink:href="#icon-tubiao-'+temp+'"></use></svg>\n' +
                    '                        <span style="display: inline-block;height:20px;vertical-align: top;max-width:180px;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" title="'+name+'">'+name+'</span>\n' +
                    '                    </div>\n' +
                    '                </td>\n' +
                    '                <td>'+SizeFormat(size)+'</td>\n' +
                    '                <td>'+dir+'</td>\n' +
                    '                <td>\n' +
                    '                    <!--<svg class="c_icon" aria-hidden="true" style="width: 1.1em"><use xlink:href="#icon-agree"></use></svg>-->\n' +
                    '                    <div class="progress" style="margin-bottom: 0;">\n' +
                    '                        <div id="upload_'+(index+trNum)+'" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;color: black">\n' +
                    '                            '+((size >= 1024*1024*1024*2)? '文件不能超过2G':'正在建立连接')+'\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </td>\n' +
                    '            </tr>');
                if(size >= 1024*1024*1024*2){
                    console.log("文件太大无法上传");
                }else{
                    fileUpload(index+trNum, file);
                }
            }
            //重置file组件
            $('#file').replaceWith('<input type="file" class="btn btn-primary" name="file" id="file" multiple>');
        });
    });

    /**
     * 前端获取文件md5值
     * @param file
     * @param callBack md5值作为回调函数的参数
     */
    function getFileMd5(file,callBack) {
        var fileReader = new FileReader(),
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
            //提高这个数字可以提高计算md5速度
            chunkSize = 2097152*100,
            // read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5();

        fileReader.onload = function (e) {
            spark.appendBinary(e.target.result); // append binary string
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            }
            else {
                callBack(spark.end());
            }
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        loadNext();
    }


});