$(document).ready(function(){
    /**
     * 清空全部
     */
    $('#deleteAll_button').on('click',function () {
        $('#deleteAll').modal('hide');
        ajax('{}','http://cloud2.test/home/deleteAll',function (data) {
            if(1 == data.status){
                layer.msg(data.message);
                $('#table tbody tr').remove();
            }else if(0 == data.status){
                layer.msg(data.message);
            }
            console.log(data);
        },function (data) {
            console.log(data);
        });
    });

    /**
     * 回收站文件还原功能
     */
    $('#b-down button:eq(0)').on('click',function () {
        console.log(getCheckdirefileid());
        var checked = getCheckdirefileid();
        ajax({checked:checked},'http://cloud2.test/home/restore',function (data) {
            if(1 == data.status){
                layer.msg(data.message);
                $.each(checked[1],function (index, item) {
                    $('#table tbody tr').each(function (i) {
                        console.log($(this));
                        if($(this).attr('data-userfileid') == item){
                            $(this).remove();
                            }
                    });
                });
                itemNum();
            }else if(0 == data.status){
                layer.msg(data.message);
            }
            console.log(data);
        },function (data) {
            console.log(data);
        });
    });

    /**
     * 和分享按钮事件冲突
     * 永久删除
     */
    $('#b-down button:eq(1)').on('click',function () {
        var checked = getCheckdirefileid();
        ajax({checked:checked},'http://cloud2.test/home/deleteForever',function (data) {
            if(1 == data.status){
                layer.msg(data.message);
                $.each(checked[1],function (index, item) {
                    $('#table tbody tr').each(function (i) {
                        console.log($(this));
                        if($(this).attr('data-userfileid') == item){
                            $(this).remove();
                        }
                    });
                });
                itemNum();
            }else if(0 == data.status){
                layer.msg(data.message);
            }
            console.log(data);
        },function (data) {
            console.log(data);
        });

    });
});