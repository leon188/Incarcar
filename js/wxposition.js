var latitude;
var longitude;
var pageUrl=encodeURIComponent(window.location.href.split('#')[0]);

$.ajax({
	type:"get",
	url:ektUrl+"/wechat/access-config.json?url="+pageUrl,
	async:true,
	success:function(data){

		if (data.status==200) {
			console.log(data);
			positionReady(data);
		}
	}
});

var isReady=false;


function positionReady(data){

	wx.config({

        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.attachment.appId+"", // 必填，公众号的唯一标识
        timestamp: data.attachment.timestamp+"", // 必填，生成签名的时间戳
        nonceStr: data.attachment.nonceStr+"", // 必填，生成签名的随机串
        signature:data.attachment.signature+"",// 必填，签名，见附录1
		jsApiList: [
			'getLocation'
		]
	});

	wx.ready(function() {
        weui.Loading.show();
		isReady=true;
		doPosition()
	})

	wx.error(function(res) {
        weui.Loading.hide();

	});
}

function doPosition(){
	console.log(isReady)

	if (isReady) {
		wx.getLocation({
			type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function(res) {
				latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				var speed = res.speed; // 速度，以米/每秒计
				var accuracy = res.accuracy; // 位置精度
				console.log(999)
				weui.Loading.hide();
				fn(longitude,latitude)
			},
			fail: function() {
				weui.Loading.hide();
				weui.alert("请进入手机“设置”，开启“微信定位”，然后刷新页面或重新进入继续使用","小兔提示:",function () {

				})
			}
		});
        setTimeout(function () {
            weui.Loading.hide();
        },3000)
	}

}