//根据ID 和 class 和  tag找到元素
//如果是id 前面就有#
//如果是class 前面就有.
//如果是tag 直接是本身
function $(sele,context){
	context = context || document; //context默认为document
	if(sele[0] == "#"){
		return context.getElementById(sele.slice(1));
	}
	if(sele[0] == "."){ 
		//return context.getElementsByClassName(sele.slice(1));
		return getByClassName(sele,context);
	}
	return context.getElementsByTagName(sele);
}

//解决IE9以下不认识getElementsByClassName的兼容问题
function getByClassName(sele,context){
	context = context || document; //context默认为document
	if(context.getElementsByClassName){ //判断浏览器是不是认识这个方法，认识就直接返回
		return context.getElementsByClassName(sele.slice(1));
	}
	//不认识的话先找到所有的元素节点
	var allTags = context.getElementsByTagName("*"); //*代表context元素对象下面所有的节点
	//接着判断这些节点的class属性是不是和sele一样
	var classedTags = []; //用一个数组存放符合条件的元素对象
	for(var i = 0,len = allTags.length;i<len;i++){
		//由于一个元素对象可能有多个class ，所以这里要在内部再做一个循环遍历里面的class
		var classes = allTags[i].className.split(" ") //先把class的一串字符按空格分割成一个一个的再循环
		for(var j = 0,lth = classes.length;j<lth;j++){
			if(classes[j] == sele.slice(1) ){//找到某个class值和sele一样
				classedTags.push(allTags[i]);//就将那个元素push到之前的数组
				break;//就不需要判断后面的class了退出内层循环
			}
		}
	}
	return classedTags;//返回这个class数组
}

//获取指定元素在文档中的定位或者设置元素在文档中的绝对定位
function offset(elem,posi){
	var ot = 0,ol = 0;
	if(typeof posi == "undefined"){ //第二个参数未定义就获取指定元素在文档中定位
		// 先得到距离有定位祖先元素位置
		while(elem.offsetParent !== null){
			ot += elem.offsetTop; 
			ol += elem.offsetLeft;//再加上爸爸与爸爸的爸爸的距离，直到没有爸爸
			elem = elem.offsetParent; //找到他的定位爸爸
		}
		
		//返回一个定位的对象
		return {
			left:ol,
			top:ot
		};
	}else if(typeof posi == "object"){
		var parent = elem.offsetParent;
		var off = offset(parent);
		var pl = posi.left - off.left;
		var pt = posi.top - off.top;
		
		
		//返回定位坐标的对象
		return {
			left:pl,
			top:pt
		};
	}
}

/* 
 JS获取/设置CSS样式的函数
 */
function css(elem,attr,val){
	if(typeof attr === "string" && val === undefined){ //当attr是字符串且没有设置val时，就是获得当前的样式
		var styles = window.getComputedStyle?//判断是不是存在，兼容IE
			window.getComputedStyle(elem)[attr]:
			elem.currentStyle[attr];//因为传的是字符串 如果打点调用直接就是调用attr 然而没有这个属性
		return styles;//返回这个样式
	}else if(typeof attr === "object" && val === undefined){//当attr是对象且没有设置val时，就是设置当前元素的多个样式
		for(var styles in attr){ //循环遍历这个对象，取出里面的属性和值
			elem.style[styles] = attr[styles];
		}
	}else if(typeof attr === "string" && val){//当传了三个参数，就表示设置当前元素的某一个样式
		elem.style[attr] = val;
	}
	
}


/*
给某个元素绑定监听事件的函数
*/
function on(elem,type,callback){
	if(elem.addEventListener){
		if(type.indexOf("on") === 0){
			type = type.slice(2);
		}
		elem.addEventListener(type,callback,false);
	}else{
		if(type.indexOf("on") !== 0){
			type = "on" + type;
		}
		elem.attachEvent(type,callback);
	}
}

function off(elem,type,callback){
	if(elem.removeEventListener){
		if(type.indexOf("on") === 0){
			type = type.slice(2);
		}
		elem.removeEventListener(type,callback,false);
	}else{
		if(type.indexOf("on") !== 0){
			type = "on" + type;
		}
		elem.detachEvent(type,callback);
	}
}

/*根据cookie名字查询对应cookie值*/
function cookie(key,val,options){
	if(val == undefined){ //如果没有设置val就是查询
		var cookies = document.cookie; //先把整个一个cookie的字符串搞出来
		var source = cookies.split("; ");//将每个数据分割出来
		var data,val;//存放cookie的键值对和cookie值
		for(let i = 0,len = source.length;i<len;i++ ){ //遍历每个数据
			data = source[i].split("="); //找到数据值的数组
			if(data[0] == key){ //如果数据名和传入的key相等
				val = decodeURIComponent(data[1]);//将数据值解码后值赋值给val
				return val; //返回val
			}
		}
		//找不到返回空
		return null;
	}else{ //设置cookie值
		var cookies = encodeURIComponent(key) + "=" + encodeURIComponent(val);
		options = options || {}; //判断有没有其他的可选参数，比如expires、path等
		if(typeof options.expires === "number"){  //expires可以为number也可以为时间对象
			var date = new Date();
			date.setDate(date.getDate() + options.expires);
			cookies += "; expires=" + date.toUTCString();
		}
		if(typeof options.expires === "object"){
			cookies += "; expires=" + options.expires;
		}
		if(options.path){
			cookies += "; path=" + options.path;
		}
		if(options.domain){
			cookies += "; domain=" + options.domain;
		}
		if(options.secure){
			cookies += "; secure";
		}
		document.cookie = cookies;
		console.log(cookies);
	}
		
}

//移除cookie的函数
function removeCookie(key){
	cookie(key,"",-1);
}


//判断一个值是否在数组中存在，并返回数组的下标，不存在就返回-1
function inArray(val,arr){
	if(Array.prototype.indexOf){
		return array.indexOf(val);
	}

	for( var i = 0,len = arr.length; i < len;i++){
		if(val === array[i]){
			return i;
		}
	}
	return -1;
}

//去掉字符串前后的空白
function trim(str){
	if(String.prototype.trim){
		return str.trim;
	}
	var reg = /^\s+|\s+$/g;
	return str.replace(reg, "");
}

/*
给指定元素设置动画的函数(目前只能改变单位为px和透明度，不能改变颜色)
elem：要操作的元素节点对象
options：表示要改变多个css属性的一个对象
speed：动画的持续时间，默认为1000ms
fn:完成动画后执行的函数
*/
function anime(elem,options,speed,fn){
	//先取消在之前已有的动画计时器
	clearInterval(elem.timer)
	var start = {};//先定义一个空对象存放初始css属性
	for(let attr in options){ //遍历options里面的属性
		//取得每个初始属性值
		start[attr] = parseFloat(css(elem,attr));
	}
	var timestamp = +new Date(); //获得计时器前时间
	elem.timer = setInterval(function(){
		var current = +new Date(),//获得每次的时间
			diff = current - timestamp;//取得时间差
		for(let attr in options){
			var vi = (options[attr] - start[attr])/speed,
			//时间差乘速度加上起始位置
			distance = Math.min(speed,diff)*vi + start[attr];
			elem.style[attr] = distance + (attr === "opacity" ?"":"px");//更新属性
			if (attr === "opacity"){
				//透明度兼容IE
				elem.style.filter = "alpha(opacity="+(distance*100)+")";
			}
		}
		if (diff == speed) {
			clearInterval(elem.timer); 
			fn && fn();//如果fn存在就执行fn() 相当于if判断
		}
	},1000/60);
}

// 淡入
function fadeIn(elem, speed, fn) {
	elem.style.opacity = 0;
	elem.style.display = "block";

	anime(elem, {opacity:1}, speed, fn);
}

// 淡出
function fadeOut(elem, speed, fn) {
	anime(elem, {opacity:0}, speed, function(){
		elem.style.display = "none";
		fn && fn();
	})
}


// 封装ajax操作函数
// 参数 options 为可配置项内容
// options = {
// 	type : "get|post", // 请求方式，默认为 get
// 	url : "http://xxx", // URL
// 	async : true, // 是否异步，默认为异步
// 	data : {username:""}, // 需要向服务器提交的数据
// 	dataType : "text|json", // 预期从服务器返回的数据格式
// 	headers : {"name":"value"}, // 额外设置的请求头
// 	success : function(respData){}, // 请求成功时执行的函数
// 	error : function(errMsg){}, // 请求失败时执行的函数
// 	complete : function(xhr){} // 不论成功/失败都会执行的函数
// }
function ajax(options){
	options = options || {};
	//判断是否有连接的url
	if(!options.url){
		return; //如果没有url就直接结束函数执行
	}
	var url = options.url;

	//创建xhr对象
	if(window.XMLHttpRequest){ //如果有这个构造函数就直接创建
		var xhr = new XMLHttpRequest();
	}else{
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");//兼容IE
	}

	//设置请求方式
	var method = options.type || "get";
	//设置是否异步
	var async = (typeof options.async === "boolean") ? options.async : true;
	// 判断是否有向服务器传递参数
	var param = null; // 保存查询字符串的变量
	if (options.data) { // 有传递参数
		var array = []; // 保存键值对结构的数组
		for (var attr in options.data) {
			array.push(attr + "=" + options.data[attr]); // ["key=value", "key=value"]
		}
		param = array.join("&"); // key=value&key=value&key=value
	}
	// 如果是 get 请求，则将查询字符串连接在 URL 后
	if (method === "get" && param){
		url += "?" + param;
		param = null;
	}
	// 建立连接
	xhr.open(method, url, async);
	// post传递参数时，设置请求头 Content-Type
	if (method === "post"){
		// 设置请求头信息
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	// 其它额外设置的请求头
	if (options.headers) {
		for (var attr in options.headers) {
			xhr.setRequestHeader(attr, options.headers[attr]);
		}
	}
	// 发送请求
	xhr.send(param);
	// 处理响应
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			// 无论成功或失败都会执行的函数
			options.complete && options.complete(xhr);

			if (xhr.status === 200) { // 成功
				var data = xhr.responseText;
				// 判断配置中预期从服务器返回的数据类型
				// 如果是 json，则调用 JSON.parse() 解析
				if (options.dataType === "json")
					data = JSON.parse(data);
				// 处理响应数据逻辑
				options.success && options.success(data);
			} else { // 失败
				options.error && options.error(xhr.statusText);
			}
		}
	}
}


// 使用 Promise 对象实现ajax异步操作
function get(_url) {
	return new Promise(function(resolve, reject){
		ajax({
			url : _url,
			type : "get",
			dataType : "json",
			success : function(data){
				resolve(data);
			},
			error : function(errorMsg){
				reject(errorMsg);
			}
		});
	});
}