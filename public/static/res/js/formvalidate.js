//是否同意交理云协议
function server(e){
    form = document.getElementById('loginForm');
    mask = document.getElementsByClassName('mask')[0];
    is_check = e.firstChild.firstChild;
    if(is_check.getAttribute("xlink:href") == '#icon-disagree'){
        is_check.href.baseVal = "#icon-agree";
        form.style.visibility = 'visible';
        console.log(form.clientHeight);
        mask.style.display = 'none';
    } else if(is_check.getAttribute("xlink:href") == '#icon-agree'){
        is_check.href.baseVal = "#icon-disagree";
        form.style.visibility = 'hidden';
        mask.style.height = form.clientHeight;
        mask.style.display = 'block';
        console.log(mask.clientHeight);
    }
}
//是否记住账号
function remember(e){
    is_check = e.firstChild.firstChild;
    if(is_check.getAttribute("xlink:href") == '#icon-disagree')
        is_check.href.baseVal = "#icon-agree";
    else if(is_check.getAttribute("xlink:href") == '#icon-agree'){
        is_check.href.baseVal = "#icon-disagree";
    }
}

$(document).ready(function() {
    /*********************************************** index ***********************************************/
    //index主页账号登录表单验证
    $('#loginForm')
        .bootstrapValidator({
            message: '此值无效！',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                account: {
                    message: '用户名无效！',
                    validators: {
                        notEmpty: {
                            message: '账号不能为空！'
                        },
                        stringLength: {
                            min: 5,
                            max: 30,
                            message: '账号长度必须在5-30位之内！'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '用户名只能由字母、数字、点和下划线组成！'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空！'
                        }
                    }
                },
                verify: {
                    message: '验证码无效！',
                    validators: {
                        notEmpty: {
                            message: '验证码不能为空！'
                        },
                        stringLength: {
                            min: 4,
                            max: 4,
                            message: '验证码为4位数字'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '验证码只能由数字组成！'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            // Prevent form submission 防止表单提交
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            var remember = false;
            if($('#remember').attr('xlink:href') == '#icon-agree')
                remember = true;

            var data = $form.serializeArray();
            data[data.length] = {name: "remember", value: remember};
            data = serializeArrayToJson(data);
            console.log(data);

            // Use Ajax to submit form data
            ajax(data, "accountLoginCheck", function (data) {
                console.log("loginForm ajax 成功！");

                // 0 -- 注册失败
                // 1 -- 账号密码验证成功
                // 2 -- 账号不存在
                // 3 -- 账号或密码不正确
                // 4 -- 验证码错误
                if(data.status == 0){
                    console.log(0);
                    layer.alert(data.message);
                }else if(data.status == 1){     //账号密码验证成功
                    console.log(1);
                    //邮箱验证成功，进行跳转
                    // layer.msg(data.message);
                    location.href = "home";
                }else if(data.status == 2){     //账号不存在
                    console.log(2);
                    layer.alert(data.message);
                    $('#login_account').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                    $('#login_account').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                    $('#login_account').parent().parent().removeClass('has-success');
                    $('#login_account').parent().parent().addClass('has-error');
                }else if(data.status == 3){     //账号或密码不正确
                    console.log(3);
                    layer.alert(data.message);
                    // $('#login_password').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                    // $('#login_password').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                    // $('#login_password').parent().parent().removeClass('has-success');
                    // $('#login_password').parent().parent().addClass('has-error');
                }else if(data.status == 4){     //验证码错误
                    console.log(4);
                    layer.alert(data.message);
                    $('#login_verify').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                    $('#login_verify').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                    $('#login_verify').parent().parent().removeClass('has-success');
                    $('#login_verify').parent().parent().addClass('has-error');
                }

                console.log(data.status);
                console.log(data.message);
                console.log(data.data);
                console.log('----------loginForm ajax 成功！------------');
            },function (data) {
                console.log("loginForm ajax 失败！");
                console.log(data.status);
                console.log(data.message);
                console.log(data.data);
                console.log('----------loginForm ajax 失败！------------');
            });
        });
    //index主页邮箱登录表单验证
    $('#emailForm')
        .bootstrapValidator({
            message: '此值无效！',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                email: {
                    message: '邮箱无效！',
                    validators: {
                        notEmpty: {
                            message: '邮箱不能为空！'
                        },
                        callback: {
                            message: '邮箱格式错误！',
                            callback: function(value, validator) {
                                if(isEmail(value)){
                                    // console.log(true);
                                    // console.log($('#login_email_btn').className);
                                    $('#login_email_btn').removeAttr("disabled");
                                    return true;
                                }else{
                                    // console.log(false);
                                    // console.log($('#login_email_btn').className);
                                    $('#login_email_btn').attr({"disabled":"disabled"});
                                    return false;
                                }
                            }
                        }
                    }
                },
                verify: {
                    message: '验证码无效！',
                    validators: {
                        notEmpty: {
                            message: '验证码不能为空！'
                        },
                        stringLength: {
                            min: 4,
                            max: 10,
                            message: '验证码长度在4-10字符内'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '验证码只能由数字组成！'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            console.log("emailLogin submit");
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            var data = serializeArrayToJson($form.serializeArray());
            console.log(data);

            // Use Ajax to submit form data
            ajax(data, "emailLoginCheck", function (data) {
                console.log("loginForm ajax 成功！");

                // 0 -- 注册失败
                // 1 -- 邮箱验证成功
                // 2 -- 邮箱未绑定账号
                // 3 -- 邮箱和验证码不匹配
                if(data.status == 0){
                    console.log(0);
                    layer.alert(data.message);
                }else if(data.status == 1){     //邮箱验证成功
                    console.log(1);
                    //邮箱验证成功，进行跳转
                    location.href = "home";
                }else if(data.status == 2){     //邮箱未绑定账号
                    console.log(2);
                    layer.alert(data.message);
                    $('#login_email').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                    $('#login_email').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                    $('#login_email').parent().parent().removeClass('has-success');
                    $('#login_email').parent().parent().addClass('has-error');
                }else if(data.status == 3){     //邮箱和验证码不匹配
                    console.log(3);
                    layer.alert(data.message);
                    $('#login_email_verify').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                    $('#login_email_verify').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                    $('#login_email_verify').parent().parent().removeClass('has-success');
                    $('#login_email_verify').parent().parent().addClass('has-error');
                }

                console.log(data.status);
                console.log(data.message);
                console.log(data.data);
                console.log('----------loginForm ajax 成功！------------');
            },function (data) {
                console.log("loginForm ajax 失败！");
                console.log(data.status);
                        console.log(data.message);
                        console.log(data.data);
                console.log('----------loginForm ajax 失败！------------');
            });
        });
    //index主页注册表单验证
    $('#registerForm')
        .bootstrapValidator({
            message: '此值无效！',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                account: {
                    message: '用户名无效！',
                    validators: {
                        notEmpty: {
                            message: '账号不能为空！'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: '账号长度必须在6-30位之内！'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '用户名只能由字母、数字、点和下划线组成！'
                        },
                    }
                },
                password1: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空！'
                        },
                    }
                },
                password2: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空！'
                        },
                        identical: {
                            field: 'password1',
                            message: '两次输入的密码不相符'
                        }
                    }
                },
                email: {
                    message: '邮箱无效！',
                    validators: {
                        notEmpty: {
                            message: '邮箱不能为空！'
                        },
                        callback: {
                            message: '邮箱格式错误！',
                            callback: function(value, validator) {
                                if(isEmail(value)){
                                    $('#reg_email_btn').removeAttr("disabled");
                                    return true;
                                }else{
                                    $('#reg_email_btn').attr({"disabled":"disabled"});
                                    return false;
                                }
                            }
                        }
                    }
                },
                verify: {
                    message: '验证码无效！',
                    validators: {
                        notEmpty: {
                            message: '验证码不能为空！'
                        },
                        stringLength: {
                            min: 4,
                            max: 10,
                            message: '验证码长度在4-10字符内'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '验证码只能由数字组成！'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            console.log("registerForm submit");
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);
            // console.log($form);
            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
            // console.log(bv);

            var data = serializeArrayToJson($form.serializeArray());
            console.log(data);

            ajax(data, "register",
                function (data) {
                    console.log("loginForm ajax 成功！");

                    // 0 -- 注册失败
                    // 1 -- 注册成功
                    // 2 -- 账号被注册
                    // 3 -- 邮箱和验证码不匹配
                    // 4 -- 邮箱以被注册
                    if(data.status == 0){
                        console.log(0);
                        layer.alert(data.message);
                    }else if(data.status == 1){     //账号被注册
                        console.log(1);
                        //注册成功，进行跳转
                        layer.confirm('注册成功！是否直接登录？', {
                            btn: ['取消','登录'] //按钮
                        }, function(){
                            window.location.reload();
                        }, function(){
                            ajax('', "registerLogin",
                                function (data) {
                                    if(data.status == 1)
                                        location.href = "home";
                                    else
                                        layer.msg(data.message);
                                },function (data) {
                                    layer.msg(data.message);
                                });
                        });
                    }else if(data.status == 2){     //账号被注册
                        console.log(2);
                        layer.alert(data.message);
                        $('#reg_account').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                        $('#reg_account').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                        $('#reg_account').parent().parent().removeClass('has-success');
                        $('#reg_account').parent().parent().addClass('has-error');
                    }else if(data.status == 3){     //邮箱和验证码不匹配
                        console.log(3);
                        layer.alert(data.message);
                        $('#reg_verify').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                        $('#reg_verify').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                        $('#reg_verify').parent().parent().removeClass('has-success');
                        $('#reg_verify').parent().parent().addClass('has-error');
                    }else if(data.status == 4){     //邮箱以被注册
                        console.log(4);
                        layer.alert(data.message);
                        $('#reg_email').next().removeClass('form-control-feedback glyphicon glyphicon-ok');
                        $('#reg_email').next().addClass('form-control-feedback glyphicon glyphicon-remove');
                        $('#reg_email').parent().parent().removeClass('has-success');
                        $('#reg_email').parent().parent().addClass('has-error');
                    }
                    console.log(data);
                    console.log(data.status);
                    console.log(data.message);
                    console.log(data.data);
                    console.log('----------loginForm ajax 成功！------------');
                },function (data) {
                    console.log("loginForm ajax 失败！");
                    console.log(data);
                    console.log(data.status);
                    console.log(data.message);
                    console.log(data.data);
                    console.log('----------loginForm ajax 失败！------------');
                });
        });




    /*********************************************** modify ***********************************************/
    $('#menu1Button').on('click',function (e) {
        e.preventDefault();
        var data = serializeArrayToJson($('#basicsForm').serializeArray());
        ajax({data:data}, 'modifyServer',function (data) {
            console.log(data);
            if(1 == data.status){
                layer.msg(data.message);
            }else if(0 == data.status){
                layer.msg(data.message);
            }
        },function (data) {
            console.log(data);
            layer.msg('网络出点了问题...');
        });
        console.log(data);
    });

    $('#menu4Button').on('click',function (e) {
        e.preventDefault();
        var oldpassword = $('#oldpassword').val();
        var newpassword = $('#newpassword').val();
        var againpassword = $('#againpassword').val();
        if(oldpassword == '' || newpassword == '' || againpassword == ''){
            layer.msg('请将信息填写完全！');
        }else if(newpassword != againpassword){
            layer.msg('两次输入的密码不一致！');
        }else if(oldpassword == newpassword){
            layer.msg('新旧密码相同！');
        }else{
            var data = serializeArrayToJson($('#passwordForm').serializeArray());
            ajax({data:data}, 'modifyPasswordServer',function (data) {
                console.log(data);
                if(1 == data.status){
                    layer.msg(data.message);
                    $('#oldpassword').val('');
                    $('#newpassword').val('');
                    $('#againpassword').val('');
                }else if(0 == data.status){
                    layer.msg(data.message);
                }
            },function (data) {
                console.log(data);
                layer.msg('网络出点了问题...');
            });
        }
        console.log(data);
    });

    $('#confirm').on('click',function () {
        var choose = $(this).attr('data-headchoose');
        if('none' == choose){
            layer.msg('这已经是你的头像了！');
        }
        if('diy' == choose){
            var file = document.getElementById('file').files[0];
            if(file.size >= 1024*1024*2){
                layer.msg('头像图片大小不能大于2M！');
            }else{
                var formData = new FormData();
                formData.append('file',file);

                $.ajax({
                    type: 'post',
                    url: "modifyPictureServer",
                    data: formData,
                    dataType: 'json',
                    async: true,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (message) {
                        console.log(message);
                        layer.msg(message.message);
                        $('#preview').css('background-image','');
                        $('#confirm').attr('data-headchoose','none');
                    },
                    error: function (message) {
                        console.log(message);
                        layer.msg(message.message);
                    }
                });
            }
        }
        if('default' == choose){
            var url = $('#bigthumb').attr('src');
            ajax({url:url},'modifyDefaultPictureServer',
                function (data) {
                    layer.msg(data.message);
                    $('#preview').css('background-image','');
                    $('#confirm').attr('data-headchoose','none');
                },function (data) {
                    layer.msg('未知错误！');
            });
        }

    });

});