function animate(dom,obj,time,callback){
	// 获取运动终点对象
	// console.log(obj);
	// 获取当前对象属性值
	// 能力检测
	var CSS = function(dom){
		if(window.getComputedStyle){
			return getComputedStyle(dom);
		}else{
			return dom.currentStyle;
		}
	}
	var nowStyle = (function(){
		var temp = {};
		for(var i in obj){
			temp[i] = parseInt(CSS(dom)[i]);
		}
		return temp;
	})();
	// console.log(nowStyle);
	// 获取频数
	var pinshu = time / 10;
	// console.log(pinlv);
	// 计算步长
	var step = (function(){
		var temp = {};
		for(var i in obj){
			temp[i] = (obj[i] - nowStyle[i]) / pinshu;
		}
		return temp;
	})();
	// console.log(step);
	// 一次运动多长距离
	var count = 0;
	// console.log(dom)
	var timer = setInterval(function(){
		count ++;
		for(var i in obj){
			if(i.toLowerCase() === "opacity"){
					dom.style.filter = "alpha(opacity=" +(nowStyle[i] + step[i] * count) * 100 + ")";
					dom.style.opacity = nowStyle[i] + step[i] * count;
			}else{
				dom.style[i] = nowStyle[i] + step[i] * count + "px";
			}
		}
		// 设置限定条件
		if(count >= pinshu){
			clearInterval(timer);
			for(var i in obj){
				if(i.toLowerCase() === "opacity"){
					dom.style["filter"] = "alpha(opacity=" + obj[i] * 100 +")";
					dom.style[i] = obj[i];
				}else{
					dom.style[i] = obj[i] + "px";
				}
			}
			callback && callback();
		}
	}, 10);
}