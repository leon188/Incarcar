
var ektDebug = false;
var imgUrl = "http://kuaitu.image.alimmdn.com/kuaitudongli/picture/"
var ektUrl="https://api.ekuaitu.com";
var appVersion ="3.1.0";



//时间戳转换成 2011年3月16日 16:50 
function getDate1(tm){ 
var tt=new Date(parseInt(tm));

return tt.getMonth()+1+"月"+tt.getDate()+"日"+tt.getHours()+":"+tt.getMinutes(); 
} 

//地图去标
setTimeout(function(){
	var map_logo=document.getElementsByClassName("amap-logo")[0];
	if (map_logo) {
		map_logo.href="javascript:;";
	}
},2000)



function locationHref(nextUrl){
	if (nextUrl.indexOf("?")==-1) {
		location.href=nextUrl+"?v="+new Date().getTime();
	}else{
		location.href=nextUrl+"&v="+new Date().getTime();
	}
}


//字符串split取值  str 栗子 sWinUrl='http://m.ishugui.com/t/h5_images.php?code=001VUXdN1DGgd01ehDfN1qLUdN1VUXdm&state=123'
//getWinUrl('code')   →  '001VUXdN1DGgd01ehDfN1qLUdN1VUXdm'
function getWinUrl(str, url) {
	var sWinUrl = decodeURI(winLocalHref());
	if(url) {
		sWinUrl = decodeURI(url);
	}

	if(sWinUrl.indexOf('#') > -1) {
		sWinUrl = sWinUrl.split('#')[0];
	}

	if(sWinUrl.indexOf(str + '=') > 0) {
		sWinUrl = sWinUrl.split("?")[1];
		if(sWinUrl.indexOf('&') > 0) {
			sWinUrl = sWinUrl.split('&');
			for(var wI = 0; wI < sWinUrl.length; wI++) {
				var aWurl = sWinUrl[wI].split('=');
				if(aWurl[0] == str) {
					return aWurl[1]
				}
			}
		} else {
			var aWurl = sWinUrl.split('=');
			if(aWurl[0] == str) {
				return aWurl[1];
			}
		}
	} else {
		return '';
	}
}

//json 字符串  对象 互转   objstr  必须是对象或者是对象格式的字符串
function jsonStr(objStr) {
	if(typeof objStr == 'object') {
		return JSON.stringify(objStr);
	} else if(typeof objStr == 'string') {
		return JSON.parse(objStr);
	} else {
		//console.log('objStr:"是一个'+typeof objStr+'"类型 既不是对象也不是对象格式的字符串')
		return objStr;
	}
}

//oauth认证
function goLogin(data){ 
	var hrefUrl=location.href;
	if(hrefUrl.indexOf("?")!=-1){
		 hrefUrl = hrefUrl.split("?")[0];
		 if(data==undefined||data==null){
		 	data=""
		 }
		 hrefUrl = hrefUrl+data
		
	}
	
	if (ektDebug) {
        location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf96870f028c4c94f&redirect_uri="+encodeURIComponent(hrefUrl)+"&response_type=code&scope=snsapi_base&state=#wechat_redirect"

    } else{
		location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf96870f028c4c94f&redirect_uri="+encodeURIComponent(hrefUrl)+"&response_type=code&scope=snsapi_base&state=#wechat_redirect"
	
	}
}

//跳转链接  获取连接
function winLocalHref(str) {
	if(str) {
		window.location.href = str;
	} else {
		return window.location.href;
	}
}

//阻止浏览器的默认行为 
function stopDefault(e) {
	//阻止默认浏览器动作(W3C) 
	if(e && e.preventDefault) {
		e.preventDefault();
		//IE中阻止函数器默认动作的方式 
	} else {
		window.event.returnValue = false;
	}
	return false;
}

//阻止事件冒泡,使成为捕获型事件触发机制
function stopBubble(e) {
	//如果提供了事件对象，则这是一个非IE浏览器 
	if(e && e.stopPropagation) {
		//因此它支持W3C的stopPropagation()方法 
		e.stopPropagation();
	} else {
		//否则，我们需要使用IE的方式来取消事件冒泡 
		window.event.cancelBubble = true;
	}
}

//html5 pushState 无刷新跳转
function fPushState(url) {
	if(url) {
		window.history.pushState({}, 0, 'http://' + window.location.host + '/' + url);
	}
}

//传秒数
function getTimeStr(num) {
	var timeStr = num + '';
	var theTime = parseInt(timeStr); // 秒 
	var theTime1 = 0; // 分 
	var theTime2 = 0; // 小时 
	// alert(theTime); 
	if(theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		// alert(theTime1+"-"+theTime); 
		if(theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	var result = "" + parseInt(theTime) + "秒";
	if(theTime1 > 0) {
		result = "" + parseInt(theTime1) + "分" + result;
	}
	if(theTime2 > 0) {
		result = "" + parseInt(theTime2) + "小时" + result;
	}
	return result;
}

//时间戳转时间
 function formatDate(now,a) {
	var year=now.getYear()-100;
	var month=now.getMonth()+1;
	var date=now.getDate();
	var hour=now.getHours();
	var minute=now.getMinutes();
	var second=now.getSeconds();
	if(minute<10){
		minute="0"+minute
	}
	if(second<10){
		second="0"+second
	}
	if(month<10){
		month="0"+month
	}
	if(date<10){
		date="0"+date
	}
	
	console.log(a)
	if (a==1) {
		return "20"+year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	} else if(a==2){
		return hour+":"+minute+":"+second;
	} else{
		return "20"+year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	}
	
}

function gaintime (time){
	return formatDate(new Date(time))
}

