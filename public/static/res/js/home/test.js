$(document).ready(function() {

    addCheckbox();
    numCheckbox();
    myCheckbox();
    sortCheck();
    itemNum();

    //eq() 从0开始
    // var user_id = $('#navbarSupportedContent ul:eq(1) li a:eq(1)').attr("id");

    /**
     * 该部分代码实现动态添加多选框
     */
    function addCheckbox() {
        var $tbr = $('#table tbody tr');
        var $checkItemTd = $('<td><span class="iconfont icon-duoxuankuang1 my-check"></span></td>');
        $tbr.prepend($checkItemTd);
    }
    /**
     * 该部分代码实现总选框的功能(表格左上角单机全选与取消全选)
     * data-ischeck是动态添加的自定义属性，用于判断该多选框是否被选中
     */
    function numCheckbox() {
        var $thr = $('#table thead tr');
        var $tb = $('#table tbody');
        var $tbr = $('#table tbody tr');
        var $checkAll = $thr.find('.num-check');
        $checkAll.click(function(event){
            console.log("点击总选框子元素");
            var $thr = $('#table thead tr');
            var $tb = $('#table tbody');
            var $tbr = $('#table tbody tr')
            var $checkAll = $thr.find('.num-check');
            /*将所有行的选中状态设成全选框的选中状态*/
            if ($(this).attr("data-ischeck")) {
                $(this).attr("data-ischeck","");
                $(this).removeClass('icon-check-all');
                $(this).addClass('icon-duoxuankuang1');
            } else {
                $(this).attr("data-ischeck","check");
                $(this).removeClass('icon-duoxuankuang1');
                $(this).addClass('icon-check-all');
            }
            /*对处于选中状态的行添加data-ischeck属性*/
            $tbr.find('.my-check').attr('data-ischeck',$(this).attr('data-ischeck'));
            /*并调整所有选中行的CSS样式*/
            if ($(this).attr('data-ischeck')) {
                $tbr.find('.my-check').parent().parent().addClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find("a").addClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").removeClass('color-sblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").addClass('color-ssblue');
                $tbr.find('.my-check').addClass('icon-fuxuankuang11');
                $tbr.find('.my-check').removeClass('icon-duoxuankuang1');
            } else{
                $tbr.find('.my-check').parent().parent().removeClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find("a").removeClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").removeClass('color-ssblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").addClass('color-sblue');
                $tbr.find('.my-check').removeClass('icon-fuxuankuang11');
                $tbr.find('.my-check').addClass('icon-duoxuankuang1');
            }
            /*如果有一个按钮处于被选中的情况，顶端导航栏只显示下载、分享、删除按钮组*/
            topCheck();
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击全选框所在单元格时也触发全选框的点击操作*/
        $thr.find("#numcheckbox").click(function(){
            console.log('点击总选框父元素');
            $(this).find('.num-check').click();
        });
    }
    /**
     * 该部分代码实现单行多选框的功能，并且当所有的多选框被选中的时候，总选框也会被选中
     */
    function myCheckbox() {
        var $thr = $('#table thead tr');
        var $tb = $('#table tbody');
        var $tbr = $('#table tbody tr');
        var $checkAll = $thr.find('.num-check');
        // $tbr.find('.my-check').click(function () {
        //     colorCheck($(this));
        //     topCheck();
        //     event.stopPropagation();
        // });
        // $tbr.find('.my-check').parent().parent().click(function(){
        //     $(this).find('.my-check').click(colorCheck($(this).find('.my-check')));
        //     $(this).find('.my-check').click(topCheck());
        // });
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
        var $tbr = $('#table tbody tr');
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
        if($tbr.find('.icon-fuxuankuang11').length == $tbr.length){
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
        var $tbr = $('#table tbody tr');
        if($tbr.find('.icon-fuxuankuang11').length!=0){
            $("#b-upload").hide();
            $("#b-new").hide();
            $("#b-note").hide();
            $("#b-share").hide();
            $("#b-recyle").hide();
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
            if ($("#p-recovery").hasClass("color-blue")) {
                $("#b-recyle").show();
            }
        }
    }
    //该部分代码暂不使用
    function initTableCheckbox() {
        var $thr = $('#table thead tr');
        // var $checkAllTh = $('<th><span class="iconfont icon-duoxuankuang1 num-check" data-ischeck=""></span></th>');
        /*将全选/反选复选框添加到表头最前，即增加一列*/
        // $thr.prepend($checkAllTh);
        /*“全选/反选”复选框*/
        var $checkAll = $thr.find('.num-check');
        $checkAll.click(function(event){
            /*将所有行的选中状态设成全选框的选中状态*/
            if ($(this).attr("data-ischeck")) {
                $(this).attr("data-ischeck","");
                $(this).removeClass('icon-check-all');
                $(this).addClass('icon-duoxuankuang1');
            } else {
                $(this).attr("data-ischeck","check");
                $(this).removeClass('icon-duoxuankuang1');
                $(this).addClass('icon-check-all');
            }
            $tbr.find('.my-check').attr('data-ischeck',$(this).attr('data-ischeck'));
            /*并调整所有选中行的CSS样式*/
            if ($(this).attr('data-ischeck')) {
                $tbr.find('.my-check').parent().parent().addClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find("a").addClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").removeClass('color-sblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").addClass('color-ssblue');
                $tbr.find('.my-check').addClass('icon-fuxuankuang11');
                $tbr.find('.my-check').removeClass('icon-duoxuankuang1');
            } else{
                $tbr.find('.my-check').parent().parent().removeClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find("a").removeClass('bg-checkblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").removeClass('color-ssblue');
                $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").addClass('color-sblue');
                $tbr.find('.my-check').removeClass('icon-fuxuankuang11');
                $tbr.find('.my-check').addClass('icon-duoxuankuang1');
            }
            /*如果有一个按钮处于被选中的情况，顶端导航栏只显示下载、分享、删除按钮组*/
            initTableCheckbox3();
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击全选框所在单元格时也触发全选框的点击操作*/
        $thr.find("#numcheckbox").click(function(){
            $(this).find('.num-check').click();
        });
        var $tb = $('#table tbody');
        var $tbr = $('#table tbody tr');
        var $checkItemTd = $('<td><span class="iconfont icon-duoxuankuang1 my-check"></span></td>');
        /*每一行都在最前面插入一个选中复选框的单元格*/
        $tbr.prepend($checkItemTd);
        /*点击每一行的选中复选框时*/
        $tbr.find('.my-check').click(function(event){
            /*调整选中行的CSS样式*/
            $(this).parent().parent().toggleClass('bg-checkblue');
            $(this).parent().parent().find("a").toggleClass('bg-checkblue');
            if($(this).hasClass('icon-fuxuankuang11')){
                $(this).removeClass('icon-fuxuankuang11');
                $(this).addClass('icon-duoxuankuang1');
                $(this).parent().parent().find(".icon-wenjianjia").removeClass('color-ssblue');
                $(this).parent().parent().find(".icon-wenjianjia").addClass('color-sblue');
            }else {
                $(this).removeClass('icon-duoxuankuang1');
                $(this).addClass('icon-fuxuankuang11');
                $(this).parent().parent().find(".icon-wenjianjia").removeClass('color-sblue');
                $(this).parent().parent().find(".icon-wenjianjia").addClass('color-ssblue');
            }
            /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
            if($tbr.find('.icon-fuxuankuang11').length == $tbr.length){
                $checkAll.removeClass('icon-duoxuankuang1');
                $checkAll.addClass('icon-check-all');
                $checkAll.attr("data-ischeck","check");
            }else {
                if ($checkAll.hasClass('icon-check-all')){
                    $checkAll.removeClass('icon-check-all');
                    $checkAll.addClass('icon-duoxuankuang1');
                }
                $checkAll.attr("data-ischeck","");
            }
            /*如果有一个按钮处于被选中的情况，顶端导航栏只显示下载、分享、删除按钮组*/
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
                    $("#b-upload").show();
                }
                if ($("#p-picture").hasClass("color-blue")) {
                    $("#b-upload").show();
                }
                if ($("#p-video").hasClass("color-blue")) {
                    $("#b-upload").show();
                }
                if ($("#p-music").hasClass("color-blue")) {
                    $("#b-upload").show();
                }
                if ($("#p-note").hasClass("color-blue")) {
                    $("#b-note").show();
                }
                if ($("#p-share").hasClass("color-blue")) {
                    $("#b-share").show();
                }
            }
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        });
        /*点击每一行时也触发该行的选中操作*/
        $tbr.click(function(){
            event.stopPropagation();
            $(this).find('.my-check').click();
        });
    }
    /**
     * 该部分代码用于处理表单排序
     */
    function sortCheck(){
        var tableObject = $('#table'); //获取id为table的table对象
        var tbHead = tableObject.children('thead'); //获取table对象下的thead
        var tbHeadTh = tbHead.find('tr .sortth'); //获取thead下的tr下的th
        var tbBody = tableObject.children('tbody'); //获取table对象下的tbody
        var tbfolderTr = tbBody.find('.tr-folder'); //获取tbody下所有文件夹的tr
        var tbfileTr = tbBody.find('.tr-file'); //获取tbody下所有文件的tr

        var sortIndex = -1;

        tbHeadTh.each(
            function (){
                var thisIndex = tbHeadTh.index($(this)); //获取th所在的列号
                //给表态th增加鼠标位于上方时发生的事件
                $(this).mouseover(function () {
                    $(this).addClass("bg-gray");
                    $(this).css("cursor","pointer");
                }).mouseout(function () {
                    //给表头th增加鼠标离开时的事件
                    $(this).removeClass("bg-gray");
                });
                $(this).click(function () {
                    //给当前表头th增加点击事件
                    var dataType = $(this).attr("type");//点击时获取当前th的type属性值
                    cleanCheck();
                    addArrow(thisIndex+1,sortIndex+1);
                    checkColumnValue(thisIndex, dataType);
                });
            });

        //对表格排序
        function checkColumnValue(index, type) {
            var tableObject = $('#table'); //获取id为table的table对象
            var tbHead = tableObject.children('thead'); //获取table对象下的thead
            var tbHeadTh = tbHead.find('tr .sortth'); //获取thead下的tr下的th
            var tbBody = tableObject.children('tbody'); //获取table对象下的tbody
            var tbfolderTr = tbBody.find('.tr-folder'); //获取tbody下所有文件夹的tr
            var tbfileTr = tbBody.find('.tr-file'); //获取tbody下所有文件的tr
            var folderValue = new Array();
            var fileValue = new Array();
            var folderStringSort = new Array();
            var fileStringSort = new Array();
            var folderTimeSort = new Array();
            var fileTimeSort = new Array();
            var folderSizeSort = new Array();
            var fileSizeSort = new Array();
            var folderid = new Array();//存储文件夹ID
            var fileid = new Array();//存储文件ID

            tbfolderTr.each(function () {
                // var tds = $(this).find('td');
                folderValue.push(type + ".separator" +$(this).html());
                var tdString = $(this).find('td a span');   //获取文件名
                folderStringSort.push(tdString.text());
                var tdTime = $(this).find('td').eq(2);   //获取文件创建时间
                folderTimeSort.push(tdTime.text());
                var tdSize = $(this).find('td').eq(3);   //获取文件大小
                folderSizeSort.push(tdSize.attr("data-size"));
                var foid = $(this).attr('data-directoryid');
                folderid.push(foid);
                $(this).html("");
            });

            tbfileTr.each(function () {
                // var tds = $(this).find('td');
                fileValue.push(type + ".separator" +$(this).html());
                var tdString = $(this).find('td a span');   //获取文件名
                fileStringSort.push(tdString.text());
                var tdTime = $(this).find('td').eq(2);   //获取文件创建时间
                fileTimeSort.push(tdTime.text());
                var tdSize = $(this).find('td').eq(3);   //获取文件大小
                fileSizeSort.push(tdSize.attr("data-size"));
                var fiid = $(this).attr('data-userfileid');
                fileid.push(fiid);
                $(this).html("");
            });
            console.log(folderid);
            console.log(fileid);

            var folderlen = folderValue.length;
            var filelen = fileValue.length;

            if (index == sortIndex) {
                //如果已经排序了则直接倒序
                folderValue.reverse();
                fileValue.reverse();
                folderid.reverse();
                fileid.reverse();
            } else {
                for (var i = 0; i < folderlen; i++) {
                    //split() 方法用于把一个字符串分割成字符串数组
                    //获取每行分割后数组的第一个值,即此列的数组类型,定义了字符串\数字\Ip
                    type = folderValue[i].split(".separator")[0];
                    for (var j = i + 1; j < folderlen; j++) {
                        //获取排序两行的比较值，比如名字，大小，时间
                        value1 = folderStringSort[i];
                        value2 = folderStringSort[j];
                        valueTime1 = folderTimeSort[i];
                        valueTime2 = folderTimeSort[j];
                        valueSize1 = folderSizeSort[i];
                        valueSize2 = folderSizeSort[j];
                        //接下来是文件名的比较
                        if (type == "string") {
                            if (value1 > value2) {
                                var temp = folderValue[j];
                                folderValue[j] = folderValue[i];
                                folderValue[i] = temp;
                                var temp2 = folderStringSort[j];
                                folderStringSort[j] = folderStringSort[i];
                                folderStringSort[i] = temp2;
                                var temp3 = folderid[j];
                                folderid[j] = folderid[i];
                                folderid[i] = temp3;
                            }
                        }
                        //比较文件创建时间
                        else if (type == "time") {
                            if (CompareDate(valueTime1,valueTime2)) {
                                var temp = folderValue[j];
                                folderValue[j] = folderValue[i];
                                folderValue[i] = temp;
                                var temp2 = folderTimeSort[j];
                                folderTimeSort[j] = folderTimeSort[i];
                                folderTimeSort[i] = temp2;
                                var temp3 = folderid[j];
                                folderid[j] = folderid[i];
                                folderid[i] = temp3;
                            }
                        }
                        else if (type == "size") {
                            if (parseInt(valueSize1) > parseInt(valueSize2)) {
                                var temp = folderValue[j];
                                folderValue[j] = folderValue[i];
                                folderValue[i] = temp;
                                var temp2 = folderSizeSort[j];
                                folderSizeSort[j] = folderSizeSort[i];
                                folderSizeSort[i] = temp2;
                                var temp3 = folderid[j];
                                folderid[j] = folderid[i];
                                folderid[i] = temp3;
                            }
                        }
                        else {
                            if (value1.localeCompare(value2) > 0) {
                                //该方法不兼容谷歌浏览器
                                var temp = trsValue[j];
                                trsValue[j] = trsValue[i];
                                trsValue[i] = temp;
                            }
                        }
                    }
                }
                for (var x = 0; x < filelen; x++) {
                    //split() 方法用于把一个字符串分割成字符串数组
                    //获取每行分割后数组的第一个值,即此列的数组类型,定义了字符串\时间\大小
                    type = fileValue[x].split(".separator")[0];
                    for (var y = x + 1; y < filelen; y++) {
                        //获取排序两行的比较值，比如名字，大小，时间
                        value1 = fileStringSort[x];
                        value2 = fileStringSort[y];
                        valueTime1 = fileTimeSort[x];
                        valueTime2 = fileTimeSort[y];
                        valueSize1 = fileSizeSort[x];
                        valueSize2 = fileSizeSort[y];
                        //接下来是文件名的比较
                        if (type == "string") {
                            if (value1 > value2) {
                                var temp = fileValue[y];
                                fileValue[y] = fileValue[x];
                                fileValue[x] = temp;
                                var temp2 = fileStringSort[y];
                                fileStringSort[y] = fileStringSort[x];
                                fileStringSort[x] = temp2;
                                var temp3 = fileid[y];
                                fileid[y] = fileid[x];
                                fileid[x] = temp3;
                            }
                        }
                        else if (type == "time") {
                            if (CompareDate(valueTime1,valueTime2)) {
                                var temp = fileValue[y];
                                fileValue[y] = fileValue[x];
                                fileValue[x] = temp;
                                var temp2 = fileTimeSort[y];
                                fileTimeSort[y] = fileTimeSort[x];
                                fileTimeSort[x] = temp2;
                                var temp3 = fileid[y];
                                fileid[y] = fileid[x];
                                fileid[x] = temp3;
                            }
                        }
                        else if (type == "size") {
                            console.log("333");
                            if (parseInt(valueSize1) > parseInt(valueSize2)) {
                                var temp = fileValue[y];
                                fileValue[y] = fileValue[x];
                                fileValue[x] = temp;
                                var temp2 = fileSizeSort[y];
                                fileSizeSort[y] = fileSizeSort[x];
                                fileSizeSort[x] = temp2;
                                var temp3 = fileid[y];
                                fileid[y] = fileid[x];
                                fileid[x] = temp3;
                            }
                        }
                        else {
                            if (value1.localeCompare(value2) > 0) {
                                //该方法不兼容谷歌浏览器
                                var temp = trsValue[y];
                                trsValue[y] = trsValue[x];
                                trsValue[x] = temp;
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < folderlen+filelen; i++) {
                if(i<folderlen){
                    $("#table tbody tr:eq(" + i + ")").html(folderValue[i].split(".separator")[1]);
                    $("#table tbody tr:eq(" + i + ")").attr('data-directoryid',folderid[i]);
                }else {
                    $("#table tbody tr:eq(" + i + ")").html(fileValue[i-folderlen].split(".separator")[1]);
                    $("#table tbody tr:eq(" + i + ")").attr('data-userfileid',fileid[i-folderlen]);
                }
            }

            sortIndex = index;
        }
        //将日期字符串进行比较
        function CompareDate(d1,d2) {
            return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
        }
        //清除单行tr的样式
        function cleanCheck() {
            var $thr = $('#table thead tr');
            var $tb = $('#table tbody');
            var $tbr = $('#table tbody tr')
            var $checkAll = $thr.find('.num-check');
            /*将所有行的选中状态设成全选框的选中状态*/
            $checkAll.removeClass('icon-check-all');
            $checkAll.addClass('icon-duoxuankuang1');
            /*对所有行的data-ischeck属性进行改变*/
            $thr.find('.num-check').attr('data-ischeck','');
            $tbr.find('.my-check').attr('data-ischeck','');
            /*并调整所有选中行的CSS样式*/
            $tbr.find('.my-check').parent().parent().removeClass('bg-checkblue');
            $tbr.find('.my-check').parent().parent().find("a").removeClass('bg-checkblue');
            $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").removeClass('color-ssblue');
            $tbr.find('.my-check').parent().parent().find(".icon-wenjianjia").addClass('color-sblue');
            $tbr.find('.my-check').removeClass('icon-fuxuankuang11');
            $tbr.find('.my-check').addClass('icon-duoxuankuang1');
            /*如果有一个按钮处于被选中的情况，顶端导航栏只显示下载、分享、删除按钮组*/
            topCheck();
            /*阻止向上冒泡，以防再次触发点击操作*/
            event.stopPropagation();
        }
        //动态添加排序的箭头
        function addArrow(index,indexsort) {
            var $allArrow = $('#table thead tr th');
            var $tdArrow = $('#table thead tr th').eq(index);
            var $upArrow = '<span class="icon iconfont icon-up "></span>';
            var $downArrow = '<span class="icon iconfont icon-down "></span>';
            $('#table thead tr th span:not(:first)').remove();
            if ($tdArrow.attr('data-sort')=='down'){
                $tdArrow.attr('data-sort','up');
            } else {
                $tdArrow.attr('data-sort','down');
            }
            if (index == indexsort){
                if($tdArrow.attr('data-sort')=='up'){
                    $tdArrow.html($tdArrow.html()+$downArrow);
                }else{
                    $tdArrow.html($tdArrow.html()+$upArrow);
                }
            } else {
                if($tdArrow.attr('data-sort')=='up'){
                    $tdArrow.html($tdArrow.html()+$downArrow);
                }else{
                    $tdArrow.html($tdArrow.html()+$upArrow);
                }
            }
        }
    }
    /**
     * 该部分代码实现新文件的单行多选框的功能，并且当所有的多选框被选中的时候，总选框也会被选中
     */
    function newmyCheckbox() {
        var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
        console.log($tbr);
        $tbr.find('.my-check').click(function () {
            console.log("子点击");
            newcolorCheck($(this));
            topCheck();
            event.stopPropagation();
        });
        $tbr.find('.my-check').parent().parent().click(function(){
            console.log("父点击");
            $(this).find('.my-check').click(colorCheck($(this).find('.my-check')));
            $(this).find('.my-check').click(topCheck());
        });
    }
    /**
     * 该部分代码为新文件点击变色算法，供其他事件调用
     */
    function newcolorCheck(this1) {
        var $thr = $('#table thead tr');
        var $tb = $('#table tbody');
        var $tbr = $('#table tbody tr').find('.badge-success').parent().parent();
        var $tbrall = $('#table tbody tr');
        var $checkAll = $thr.find('.num-check');
        console.log('变变变');
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




    /**
     * 请求后台数据并替换显示内容
     * @param directory_id 目录id
     */
    function requestAndReplace(directory_id){
        var data = {directory_id:directory_id};
        ajax(data,"http://cloud2.test/home/openDirectory",
            function (data) {
                console.log(data);
                if(data.status === 1){
                    $('#table tbody tr').remove();
                    // var length = 0;
                    if(data.data['directory'] != null){
                        $.each(data.data['directory'],function (index, item) {
                            // length++;
                            $('#table tbody').append('<tr class="tr-folder" data-directoryId="'+item["directory_id"]+'">\n' +
                                '            <td>\n' +
                                '                <div></div>\n' +
                                '                <span class="icon iconfont icon-wenjianjia color-sblue file-icon-size"></span>\n' +
                                '                <a href="javascript:void(0)" class="loadDirectory" id='+item["directory_id"]+' title="'+item["directory_name"]+'"><span>'+item["directory_name"]+'</span></a>\n' +
                                '            </td>\n' +
                                '            <td>'+item["directory_create"]+'</td>\n' +
                                '            <td data-size="'+item["size"]+'">'+item["sizeFormat"]+'</td>\n' +
                                '        </tr>');
                        });
                    }
                    if(data.data['files'] != null){
                        $.each(data.data['files'],function (index, item) {
                            console.log(item);
                            // length++;
                            var temp = '<span class="icon iconfont icon-tubiao-unknown color-sblue file-icon-size"></span>';
                            //如果有后缀在iconfont库中的文件，则修改样式为对应的iconfont样式
                            if(file_type.indexOf(item["file_type"]) > -1){
                                //如果后缀为可显示缩略图的，则显示缩略图
                                if((item['thumb_info']) && (item["file_type"] == 'jpg' || item["file_type"] == 'png' || item["file_type"] == 'gif' || item["file_type"] == 'bmp')){
                                    temp = '<img src="'+item['thumb_info']['thumb_path']+'" class="img-thumbnail" style="width: 40px;height: 40px;padding: 0.1rem;" alt="加载失败">';
                                }else{
                                    temp = '<span class="icon iconfont icon-tubiao-'+item['file_type']+' color-sblue file-icon-size"></span>';
                                }
                            }

                            $('#table tbody').append('<tr class="tr-file" data-userFileId="'+item["user_file_id"]+'">\n' +
                                '            <td>\n' +
                                '                <div></div>\n' +
                                '                '+temp+'\n' +
                                '                <a href="javascript:void(0)" class="file" data-fileid='+item["user_file_id"]+' title="'+item["file_name"]+'"><span>'+item["file_name"]+'</span></a>\n' +
                                '            </td>\n' +
                                '            <td>'+item["user_file_create"]+'</td>\n' +
                                '            <td data-size="'+item["size"]+'">'+item["sizeFormat"]+'</td>\n' +
                                '        </tr>');
                        });
                    }
                    if(data.data['useSpaceFormat'] != null){
                        $('#p-capacity span span').text(data.data['useSpaceFormat']);
                    }
                    addCheckbox();
                    // numCheckbox();
                    myCheckbox();
                    topCheck();
                    itemNum();
                    // console.log(data.data['breadcrumb']);
                    Breadcrumb(data.data['breadcrumb']);
                }
            },function (data) {
                console.log(data);
            });
    };

    /**
     * 点击目录触发操作，事件委托给document
     * append添加的元素无法触发点击事件
     */
    $(document).on('click','.loadDirectory',function (event) {

        var directory_id = $(this).attr("id");
        console.log(directory_id);
        var directory_name = $(this).children('span').text();
        console.log(directory_name);

        requestAndReplace(directory_id);

        var state = {
            title: directory_id,
        };

        if (event && /\d/.test(event.button)) {
            //添加历史记录，但是不跳转页面
            if(directory_id == 1){
                history.pushState(state, null, 'http://cloud2.test/home');
            } else{
                history.pushState(state, null, 'http://cloud2.test/home/folder/'+hex_md5(directory_id)+window.btoa(directory_id));
            }
        }
    });

    /**
     * 面包屑显示
     * @param breadcrumb 后台传来的面包屑数组
     */
    function Breadcrumb(breadcrumb) {
        if(breadcrumb.length === 0){
            $('#breadcrumb a').remove();
            $('#breadcrumb span').remove();
            $('#breadcrumb').append('<span class="breadcrumb-item active" data-dirid="1">全部</span>');
        }else{
            $('#breadcrumb a').remove();
            $('#breadcrumb span').remove();
            $('#breadcrumb').append('<a class="breadcrumb-item loadDirectory" id="1" data-dirid="1" href="javascript:void(0)">全部</a>');
            $.each(breadcrumb,function (index, item) {
                if(index < breadcrumb.length-1){
                    $('#breadcrumb').append('<a class="breadcrumb-item loadDirectory" id="'+item["directory_id"]+'" data-dirid="'+item["directory_id"]+'" href="javascript:void(0)">'+item["directory_name"]+'</a>');
                }else{
                    $('#breadcrumb').append('<span class="breadcrumb-item active" id="'+item["directory_id"]+'"data-dirid="'+item["directory_id"]+'" >'+item['directory_name']+'</span>');
                }

            });
        }
    }

    /**
     * 实现前进后退不刷新整个网页
     */
    if (history.pushState) {
        window.addEventListener("popstate", function(e) {
            var url = location.href;
            var urlSplit = url .split("/");
            if(urlSplit.length === 4){
                console.log('home');
                requestAndReplace(1);
            }else if(urlSplit.length === 6 && urlSplit[4] === 'folder'){
                requestAndReplace(e.state.title);
            }
        });
    }

    /**
     * 实时监听输入文件夹名称input变化，控制按钮是否允许点击
     */
    $('#create_directory').find('.modal-body').find('.form-control').bind('input propertychange',function () {
        $(this).removeClass('is-invalid');
        if($(this).val() == '' || RegExp("^[ ]+$").test($(this).val())){
            $(this).next().children('.btn').attr("disabled",true);
        }else {
            if(hasDirectoryName($(this).val())){
                $(this).addClass('is-invalid');
                $(this).next().children('.btn').attr("disabled",true);
            }else{
                $(this).next().children('.btn').removeAttr("disabled");
            }
        }
    });



    /**
     * 新建文件夹的弹出模态框的新建按钮的点击事件
     */
    $('#create_directory').find('.modal-body').find('.btn').on('click',function () {
        var dir_name = $(this).parent().prev().val();
        var parent_id = $('#breadcrumb span').attr('data-dirid');
        ajax({parent_id:parent_id,directory_name:dir_name},"http://cloud2.test/home/createDirectoryServer",
            function (data) {
                console.log(data);
                if(data.status === 1){
                    removeCheckbox();
                    $('#table tbody').prepend('<tr class="tr-folder" data-directoryId="'+data.message["directory_id"]+'">\n' +
                        '            <td>\n' +
                        '                <div></div>\n' +
                        '                <span class="icon iconfont icon-wenjianjia color-sblue file-icon-size"></span>\n' +
                        '                <a href="javascript:void(0)" class="loadDirectory" id='+data.message["directory_id"]+'><span>'+data.message["directory_name"]+'</span></a>\n' +
                        '                <span class="badge badge-secondary badge-success">New</span>' +
                        '            </td>\n' +
                        '            <td>'+data.message["directory_create"]+'</td>\n' +
                        '            <td data-size="'+data.message["size"]+'">'+data.message["sizeFormat"]+'</td>\n' +
                        '        </tr>');
                    addCheckbox();
                    newmyCheckbox();
                    itemNum();
                    $('#create_directory').find('.modal-body').find('.form-control').val('');
                    $('#create_directory').modal('hide');
                }else{
                    console.log(data.message);
                }
            },function (data) {
                console.log(data);
            });
    });

    /**
     * 检测文件名是否重复
     * @param directory_name
     * @returns {boolean}
     */
    function hasDirectoryName(directory_name) {
        var flag = false;
        var span = $('#table .loadDirectory span');
        $.each(span,function () {
            if(directory_name === $(this).text())
                flag = true;
        });
        return flag;
    }


    $('#b-down button:eq(1)').on('click',function () {
        layer.msg("该功能暂未开放！");
    });

    /**
     * 点击删除按钮删除目录或文件
     */
    $('#delete_button').on('click',function () {
        console.log(getCheckdirefileid());
        var checked = getCheckdirefileid();
        console.log(checked);
        ajax({checked:checked},"http://cloud2.test/home/deleteServer",
        function (data) {
            console.log('success');
            console.log(data);
            if(data.status == 1){
                var url = location.href;
                var urlSplit = url.split("/");
                if(urlSplit.length === 5 && (urlSplit[4] === 'photo' || urlSplit[4] === 'doc' || urlSplit[4] === 'video' || urlSplit[4] === 'audio')){
                    $.each(checked[1],function (index, item) {
                        $('#table tbody tr').each(function (i) {
                            console.log($(this));
                            if($(this).attr('data-userfileid') == item){
                                $(this).remove();
                            }
                        });
                    });
                    itemNum();
                    layer.msg('删除成功！');
                }else{
                    requestAndReplace($('#breadcrumb span').attr('data-dirid'));
                }
                $('#delete').modal('hide');
            }else{
                console.log(data.message);
            }
        },function (data) {
                console.log('error');
            console.log(data);
        });
    });

    /**
     * 点击图片的名称，当初原图层
     */
    $(document).on('click','.file',function () {
        if('IMG' == ($(this).prev()).prop("tagName")){
            var file_id = $(this).attr('data-fileid');
            var file_name = $(this).children().text();
            ajax({file_id:file_id},"http://cloud2.test/home/getPhotoInfo",function (data) {
                if(data.status == 1){
                    var json = {
                        "title": "", //相册标题
                        "id": 123,  //相册id
                        "start": 0, //初始显示的图片序号，默认0
                        "data": [   //相册包含的图片，数组格式
                            {
                                "alt": file_name,
                                "pid": 1, //图片id
                                "src": data.data['path'], //原图地址
                                "thumb": "" //缩略图地址
                            }
                        ]
                    };
                    layer.photos({
                        photos: json
                        ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });
                }else if(data.status == 0){
                    layer.msg('123');
                    layer.msg(data.message);
                }
            },function (data) {
                layer.msg(data.message);
            });
        }else{
            return false;
        }
    });

});