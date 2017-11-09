var pageUrl=encodeURIComponent(window.location.href.split('#')[0]);
var result,latitude='',longitude='';
$.ajax({
	type:"get",
	url:ektUrl+"/wechat/access-config.json?url="+pageUrl,
	async:true,
	success:function(data){
		if (data.status==200) {
			
			gainData(data)
		}
	}
});


function gainData(data){
	wx.config({ 
	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: data.attachment.appId+"", // 必填，公众号的唯一标识
	    timestamp: data.attachment.timestamp+"", // 必填，生成签名的时间戳
	    nonceStr: data.attachment.nonceStr+"", // 必填，生成签名的随机串
	    signature:data.attachment.signature+"",// 必填，签名，见附录1
	    jsApiList: ["scanQRCode",'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
}



	wx.ready(function(){
        weui.Loading.show();
		wx.getLocation({
			type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function(res) {
				latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				var speed = res.speed; // 速度，以米/每秒计
				var accuracy = res.accuracy; // 位置精度
                weui.Loading.hide();
				
			},
			fail: function(res) {
                weui.Loading.hide();
                weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面继续使用","小兔提示:",function () {
                    $(".reload").show()
                })
			}
		});

		setTimeout(function () {
            weui.Loading.hide();
        },3000)
		
	})
	
	function saoma () {
        if(longitude==''||latitude==''){
            weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面继续使用","小兔提示:",function () {
                $(".reload").show()

            })
            return;
        }
		wx.scanQRCode({
			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			success: function (res) {
				result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				var bikeid = getWinUrl("bike",result)

				lock(bikeid)

			}
		});
	}



















