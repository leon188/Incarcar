/**
 * Created by kuaituH5 on 2017/5/8.
 */


var uid=localStorage.getItem('uid');
var token=localStorage.getItem('token');
var phoneNum=localStorage.getItem('phoneNum');
var bikeNo = getWinUrl("bikeNo");

var depositStatus;
if(bikeNo){

}else {
    $(".yuyue").text("扫码租车")
}

$(".reload").click(function () {
    $(".reload").hide()
})


$(".exit").click(function(){
    $.ajax({
        type:"post",
        url:ektUrl+"/v/user/logout.json",
        data:{
            uid:uid,
            token:token
        },
        async:true,
        success:function(data){
            if(data.status==200){
                weui.alert("退出登录成功","小兔提示:",function(){
                    localStorage.clear();
                    location.href="wx_app.html"
                })
            }
        }
    });

})
$(".phone").html(phoneNum)



$(".yuyue").click(function(){
    //判断有没有交保证金
    $.ajax({
        type:"post",
        url:ektUrl+"/v/user/validate-bike-user.json",
        data:{
            uid:uid,
            token:token
        },
        async:true,
        success:function(data){
            if (data.status==200) {
                depositStatus = 1;
            } else if(data.status==401){
                depositStatus = 0;
            }else{
                weui.alert(data.message,"小兔提示:")
            }


            if (depositStatus==0) {
                //没交保证金
                var dephref = "https://ekuaitu.com/h5/ekteasy/deposite.html?uid="+uid+"&token="+token+"&bikeNo="+bikeNo;
                location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf96870f028c4c94f&redirect_uri="+encodeURIComponent(dephref)+"&response_type=code&scope=snsapi_base&state=#wechat_redirect"

            } else if(depositStatus==1){
                //交了保证金，看有没有未完成订单
                $.ajax({
                    type:"post",
                    url:ektUrl+"/v/order/get-unfinish",
                    data:{
                        uid:uid,
                        token:token
                    },
                    async:true,
                    success:function(data){
                        if (data.status==200) {
                            if(data.attachment.isUnfinished==0){
                                // 没有未完成订单,看是否有单车编号
                                if(bikeNo){
                                    //有单车编号，直接开锁
                                    lock(bikeNo)
                                }else {
                                    //没有单车编号，去扫码
                                    saoma()
                                }

                            }else if(data.attachment.isUnfinished==1){
                                //有未完成订单，判断是骑行中还是未结算
                                var orderid = data.attachment.orderId;
                                if (data.attachment.status==15) {
                                    //未结算的订单
                                    weui.alert("您有未结算的订单","小兔提示:",function(){

                                        var accounthref = "https://ekuaitu.com/h5/ekteasy/account.html?orderid="+orderid;
                                        location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf96870f028c4c94f&redirect_uri="+encodeURIComponent(accounthref)+"&response_type=code&scope=snsapi_base&state=#wechat_redirect"

                                    });

                                } else{
                                    //骑行中的订单
                                    weui.alert("您有骑行中的订单","小兔提示:",function(){
                                        location.href = "bikerunning.html?orderid="+orderid
                                    })
                                }


                            }else{
                                //其他状态
                                weui.alert(data.message,"小兔提示:")
                            }
                        } else{
                            //400提示
                            weui.alert(data.message,"小兔提示:")
                        }

                    }
                });
            }else{
                //其他状态
                location.href="saoma.html"

            }
        }
    });




})



function lock (a){

    if(longitude==''||latitude==''){
        weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面继续使用","小兔提示:",function () {
            $(".reload").show()

        })
        return;
    }
    //查看单车可不可用
    $.ajax({
        type:"post",
        url:ektUrl+"/kuaitu-bike/v/bike/validationBike",
        data:{
            uid:uid,
            token:token,
            licenseTag:a,
            latitude:latitude,
            longitude:longitude,
        },
        async:true,
        success:function (data){
            if(data.status == 200){
                //可用，去开锁
                $(".zhehzhao").show()
                var bikeid = data.attachment.bikeInfo.bikeId;
                $.ajax({
                    type:"post",
                    url:ektUrl+"/kuaitu-bike/v/bike/scanUnlock",
                    data:{
                        uid:uid,
                        token:token,
                        bikeId:bikeid,
                        platform:0,
                        lockType:1,
                        latitude:latitude,
                        longitude:longitude,
                    },
                    async:true,
                    success:function (data1){

                        if(data1.status == 200){
                            //成功后轮询锁状态接口；
                            var orderid = data1.attachment.orderModel.id;
                            var num = 0;
                            var cont= 0;
                            setTimeout(function () {
                                getbikeinfo();
                            },1000)

                            function getbikeinfo (){
                                cont++;
                                if(cont==4){
                                    num = 1
                                }else if(cont==8){
                                    //轮询8次，开锁失败，取消订单
                                    $(".zhehzhao").hide()
                                    weui.alert("开锁失败","小兔提示:",function(){
                                        $.ajax({
                                            type:"post",
                                            data:{
                                                uid:uid,
                                                token:token,
                                                orderId:orderid,
                                            },
                                            url:ektUrl+"/kuaitu-bike/v/order/bike/cancel",
                                            async:true,
                                            success:function(resqu){
                                                if (resqu.status == 200) {
                                                    //成功取消订单
                                                    location.href="saoma.html"
                                                } else{
                                                    //取消订单失败，提示失败原因
                                                    weui.alert(resqu.message,"小兔提示:",function(){
                                                        location.href="saoma.html"
                                                    })
                                                }
                                            }
                                        });

                                    })
                                }

                                //轮询8次此接口，当锁的状态为1时，开锁成功，跳转骑行中
                                $.ajax({
                                    type:"post",
                                    url:ektUrl+"/kuaitu-bike/v/order/bike/bike-info",
                                    data:{
                                        uid:uid,
                                        token:token,
                                        bikeId:bikeid,
                                        isSelect:num
                                    },
                                    async:true,
                                    success:function(res){
                                        console.log(res.attachment.lockstatus)
                                        if(res.attachment.lockstatus==1){
                                            $(".zhehzhao").hide()
                                            var orderTime = data1.attachment.orderModel.orderTime;
                                            location.href = "bikerunning.html?orderid="+orderid+"&orderTime="+orderTime+"&bikeid="+bikeid;
                                        }
                                    }
                                });
                            }

                            //l轮训
                            setInterval(getbikeinfo,5000)



                        }else if(data1.status == 410){
                            //410状态，获取地理位置失败
                            $(".zhehzhao").hide()
                            weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面继续使用","小兔提示:",function () {
                                $(".reload").show()
                            })
                        }else {
                            //其他状态
                            $(".zhehzhao").hide()
                            weui.alert(data1.message,"小兔提示:")
                        }
                    }
                });

            }else if(longitude==''||latitude==''){
                weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面继续使用","小兔提示:",function () {
                    $(".reload").show()
                })
            }else {
                weui.alert(data.message,"小兔提示:",function () {
                    location.href='saoma.html'
                })
            }


        }
    });
}
