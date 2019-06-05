var time = 5;           //重新发送需要等待的时间
var flag = true;        //能否发送邮件的标志

//按钮点击事件，触发发送验证码操作
function interval(e) {
    var value=e.value;
    console.log(e.value);
    e.className="btn disabled";
    //根据是否可以发送标识发送邮件
    if(flag){
        var address = '';
        console.log(e.id);
        if(e.id == 'reg_email_btn'){
            address = document.getElementById('reg_email').value;
            console.log(address);
            send('register', address);
        }
        if(e.id == 'login_email_btn'){
            address = document.getElementById('login_email').value;
            console.log(address);
            send('login', address);
        }
    }
    if(time == 0){      //发送间隔时间等待完成
        e.value="获取验证码";
        e.className="btn btn-primary";
        e.removeAttribute("disabled");
        time = 5;       //这里的值要和函数外的time值相等
        flag = true;    //能否发送邮件的标志
    }else{              //发送间隔时间
        e.value="重新发送( " + time + "s )";
        e.setAttribute("disabled", true);
        time--;
        flag = false;
        setTimeout(function() {
            interval(e)
        },1000)
    }
}

//ajax请求后台发送邮件函数
//address 为收件邮箱地址
//event为发送验证码事件     login|register  登陆|注册
function send(event,address) {
    console.log("进入ajax发送邮件函数");
    var data = {status:event,email:address};
    ajax(data,"sendEmailCode",
        function (data) {
            console.log("sendEmailCode ajax 成功！");
            console.log(data.status);
            console.log(data.message);
            console.log(data.data);
            console.log('---------sendEmailCode ajax 成功！-------------');
        },
        function (data) {
            console.log("sendEmailCode ajax 失败！");
            console.log(data.status);
            console.log(data.message);
            console.log(data.data);
            console.log('----------sendEmailCode ajax 失败！------------');
        });
    console.log('---------进入ajax发送邮件函数-------------');
}




