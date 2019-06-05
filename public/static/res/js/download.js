$(document).ready(function(){

    $('#b-down button:eq(0)').on('click',function () {
        console.log(getCheckdirefileid());

        var checked = getCheckdirefileid();
        ajax({checked:checked},"http://cloud2.test/home/downloadServer",
            function (data) {
                console.log('---------- success ------------');
                console.log(data);
                if(0 == data.status){
                    layer.msg(data.message);
                }else if(1 == data.status){
                    var frame = $('<iframe style="display:none;" class="multi-download"></iframe>');
                    frame.attr('src', data.message);
                    $(document.body).after(frame);
                }
            },function (data) {
                console.log('---------- error ------------');
                console.log(data);
        });



    });







});