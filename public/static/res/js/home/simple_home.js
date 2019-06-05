$(document).ready(function () {
    $("#menu-toggle").click(function (e) {
        $("#wrapper").toggleClass("toggled");
    })


    $("#p-lately").click(function (e) {
        $("#b-upload").show();
        $("#b-new").show();
        $("#b-note").hide();
        $("#b-share").hide();
    })


    $("#p-whole").click(function (e) {
        $("#b-upload").show();
        $("#b-new").show();
        $("#b-note").hide();
        $("#b-share").hide();
    })

    $("#p-file").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
    })


    $("#p-picture").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
    })


    $("#p-video").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
    })


    $("#p-music").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
    })


    $("#p-note").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").show();
        $("#b-share").hide();
    })


    $("#p-share").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").show();
    })

    $("#p-recovery").click(function (e) {
        $("#b-upload").hide();
        $("#b-new").hide();
        $("#b-note").hide();
        $("#b-share").hide();
        $("#b-recyle").show();
    })


    $(".list-nav>a").each(function (index) {
        $(this).click(function () {
            $(this).siblings().removeClass("color-blue");
            $(this).siblings().removeClass("font-weight-bold");
            $(this).addClass("color-blue");
            $(this).addClass("font-weight-bold");
            $(this).children("span").addClass("color-blue");
            $(this).siblings().children("span").removeClass("color-blue");
        });
    });


    $(".list-nav>a").each(function () {
        $this = $(this);
        var url = $this[0].href;
        var nowurl = String(window.location);
        if( nowurl.length > 40 ){
            if ( url == nowurl.substring(0,url.length)){
                $this.addClass("color-blue");
                $this.addClass("font-weight-bold");
                $this.children("span").addClass("color-blue");
            }
        }else {
            if (url == nowurl) {
                $this.addClass("color-blue");
                $this.addClass("font-weight-bold");
                $this.children("span").addClass("color-blue");
            }
        }
    });


    $(document).ready(function () {
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
    })
})
