/****************************************************/
/**页面加载时调用的函数****/
/***************************************************/
$(function() {
	//移除登录界面的banner
	$('.banner').fadeOut(900,function() {
		$(this).remove();
		$('.os-banner').css('z-index','1');
	});
	//调用设置时间、日期方法
	getDate();
	//加载本地存储中的数据
	loadIcon();
	//调用点击右键出现弹出框方法
	createFile();
	//调用排列桌面图标方法
	arrangeItem();
	//调用设置图标选中效果
	setItemCheck();
	//调用系统设置方法
	Osset();
	//调用左下角生成小图标方法
	createItem();
	//调用点击缩略图显示iframe方法
	showIframe();
});
setInterval(function (){
	getDate();
},59000);
/****************************************************/
/**窗口变化时****/
/***************************************************/
$(window).resize(function() {
	//调用排列桌面图标方法
	arrangeItem();
});
/****************************************************/
/**函数定义部分****/
/***************************************************/

/****************************************************/
/**获取当前日期及时间****/
/***************************************************/
function getDate(){
	var dates = new Date(),
		//获取年，月，日
		year = dates.getFullYear(),
		month = dates.getMonth()+1,
		day = dates.getDate(),
		//获取时间
		hours = dates.getHours(),
		minutes = dates.getMinutes();
	//设置显示格式
	var ymd = year+'/'+month+'/'+day,
		times = hours+':'+minutes;
	$('.time').text(times);
	$('.date').text(ymd);
}
/****************************************************/
/**右键点击弹出框****/
/***************************************************/
function createFile(){
	//阻止浏览器默认右键
	$(document).on('contextmenu',function() {
		return false;
	});
	$('.content').mousedown(function(e) {
		//获取content的实际高度，宽度
		var contentOuterH = $(this).outerHeight(),
			contentOuterW = $(this).outerWidth();
		//点击右键出现弹出框
		if(e.which===3){
			//隐藏系统设置框
			$('.os').fadeOut(300);
			$('.createflie').fadeOut(300);
			var x = e.pageX,
				y = e.pageY;
			x = x > (contentOuterW-220)?(contentOuterW-220):x;
			y = y >(contentOuterH-320)?(contentOuterH-320):y;
			console.log('x:'+x);
			console.log('y:'+y);
			$('.file-box').css({
				'left':x+'px',
				'top':y+'px'
			});
			//出现文件新建弹出框
			$('.file-box').fadeIn(300);
			//调用选项按钮方法
			clickFileItem(x,y);
			//调用清空输入框值的方法
			clearInputVal();
		}
		//点击左键 弹出框消失
		if(e.which===1){
			$('.file-box').fadeOut(300);
			//隐藏系统设置框
			$('.os').fadeOut(300);
		}
	});
}
/****************************************************/
/**在弹出框中点击选项按钮做相应操作****/
/***************************************************/
function clickFileItem(x,y){
	var newX = x -120,
		newY = y;
	$('.file-box').off('click').on('click','a',function(e) {
		e.stopPropagation();
		console.log('x2:'+newX);
		console.log('y2:'+newY);
		//定义点击按钮辅助判断变量
		var clickItemIndex = $(this).index();
		//新建文件
		if(clickItemIndex===0){
			$('.createflie').css({
				'left':newX+'px',
				'top':newY+'px'
			}).fadeIn(300);
			//调用设置内容
			setCont();
		}
		//更换大图标
		if(clickItemIndex===1){
			$('.item-col li').attr('class','big');
			//设置当前选中的图标标记
			$(this).addClass('check-item').siblings().removeClass('check-item');
			//调用排列桌面图标方法
			arrangeItem();
		}
		//更换中图标
		if(clickItemIndex===2){
			$('.item-col li').attr('class','mid');
			//设置当前选中的图标标记
			$(this).addClass('check-item').siblings().removeClass('check-item');
			//调用排列桌面图标方法
			arrangeItem();
		}
		//更换小图标
		if(clickItemIndex===3){
			$('.item-col li').attr('class','');
			//设置当前选中的图标标记
			$(this).addClass('check-item').siblings().removeClass('check-item');
			//调用排列桌面图标方法
			arrangeItem();
		}
		//切换用户
		if(clickItemIndex===5){
			location.href='../index.html';
		}
		//关闭系统
		if(clickItemIndex===6){

		}
	});
}
function setCont(){
	var	filesubmit = $('.filesubmit'),
		fileName = $('.file-name'),
		fileUrl  =$('.file-url'),
		img=$('.img-url'),
		imgSrc='';
	//检查输入值是否合法
	fileName.on('input',function(){
		checkInputData();
	});
	//检查输入值是否合法
	fileUrl.on('input',function(){
		checkInputData();
	});
	$('.img-url').change(function() {
		checkInputData();
		imgSrc = $(this).val();
		if(imgSrc!=''){
			imgSrc = imgSrc.slice(imgSrc.lastIndexOf('\\')+1);
			$(this).attr('data-after',imgSrc);
		}
	});
	filesubmit.off('click').click(function() {
		var fileNameCon = fileName.val();
		var fileUrlCon = fileUrl.val();
		console.log('图片路径'+imgSrc);
			$('.content').append(`
				<li data-url="${fileUrlCon}">
					<div class="item-border">
						<img src="../imgage/${imgSrc}">
						<p>${fileNameCon}</p>
					</div>
				</li>`);
			$(this).closest('.createflie').fadeOut(300);
		//调用图标排序方法
		arrangeItem();
		//存储输入的数据
		var data=[],obj={};
		obj.fileUrl = fileUrlCon;
		obj.imgSrc = imgSrc;
		obj.fileName = fileNameCon;
		//获取本地存储数据
		var myLocalStorge = JSON.parse(localStorage.getItem('OsData'));
		if(myLocalStorge===null){
			data.push(obj);
			localStorage.setItem('OsData',JSON.stringify(data));
		}else{
			myLocalStorge.push(obj);
			localStorage.setItem('OsData',JSON.stringify(myLocalStorge));
		}
		//调用左下角生成小图标方法
		createItem();
		setTimeout(function() {
			//调用清空输入框值的方法
			clearInputVal();
		},300)
	});
	//检查是否有输入数据，并设置确定按钮状态
	function checkInputData(){
		console.log(img.val());
		if(img.val()===''){
			img.attr('data-after','请选择图片');
		}else{
			img.attr('data-after',imgSrc);
		}
		if(fileName.val()!=''&&fileUrl.val()!=''&&img.val()!=''){
			filesubmit.removeAttr('disabled');
		}else{
			filesubmit.attr('disabled',true);
		}
	}
}
function clearInputVal(){
	//清空输入框的值
	$('.createflie input').val('');
	//还原图片选择默认提示
	$('.img-url').attr('data-after','请选择图片');
	$('.filesubmit').attr('disabled',true);
}
/****************************************************/
/**加载桌面图标**/
/***************************************************/
function loadIcon(){
	//获取本地存储中的数据
	var OsData = JSON.parse(localStorage.getItem('OsData'));
	if(OsData!=''){
		for(i in OsData){
			$('.content').append(`
				<li data-url="${OsData[i].fileUrl}">
					<div class="item-border">
						<img src="../imgage/${OsData[i].imgSrc}" alt="">
						<p>${OsData[i].fileName}</p>
					</div>
				</li>
			`);
		}
		arrangeItem();
	}
}
/****************************************************/
/**排列桌面图标**/
/***************************************************/
function arrangeItem(){
	//获取内容区域的实际高度
	var contentOuterH = $('.content').outerHeight();
	//获取每个图标的实际高度
	var itemOuterH = $('li').outerHeight(),
	//计算内容区域最多放几个图标
		itemCount = Math.floor(contentOuterH/itemOuterH),
		li = $('li'),
		oldList = $('.item-list');
	//计算需要几个容器
	var itemBox  = Math.ceil(li.length / itemCount);
	for(var i = 0;i<itemBox;i++){
		$('.content').append('<ul class="item-col"></ul>');
	}
	if(oldList.length!=0){
		oldList.remove();
	}
	li.each(function(index) {
		let itemBoxindex = Math.floor(index/itemCount);
		li.eq(index).appendTo($('.item-col').eq(itemBoxindex));
	});
	//清除内容为空的列表项
	$('.item-col').each(function(i) {
		if($('.item-col').eq(i).children().length===0){
			$(this).remove();
		}
	});
	//调用设置图标双击方法
	setItemCheck();
}
/****************************************************/
/**设置图标选中效果**/
/**图标双击打开***/
/***************************************************/
function setItemCheck(){
	$('.item-col li').off('click').click(function() {
		$('.item-col li').removeClass('checked');
		$(this).addClass('checked');
	});
	$('.item-col li').off('dbclick').dblclick(function() {
//		console.log($(this).attr('data-url'));
		var thisSrc = $(this).attr('data-url'),
		//定义辅助判断该文件iframe是否存在
			isHasIframe = $('iframe').attr('src',thisSrc);
		$('iframe').closest('.iframe-box').fadeIn(300);
		//调用iframe关闭事件
		setClose();
		//显示浏览器图标
		$('.Icon').fadeIn(300).addClass('iconChecked');
	});
}
/****************************************************/
/**系统设置按钮事件**/
/***************************************************/
function Osset(){
	$('.osbtn').click(function() {
		//隐藏文件新建弹出框
		$('.file-box').fadeOut(300);
		$('.os').slideToggle(300);
	})
}
/**获取桌面图标生成相应item***/
function createItem(){
	var OsData = JSON.parse(localStorage.getItem('OsData'));
	for(x in OsData){
		$('.os').append(`
			<div class="ositem clearfix">
				<div class="ositem-img">
					<img src="../imgage/${OsData[x].imgSrc}" alt="">
				</div>
				<span class="ositem-title">${OsData[x].fileName}</span>
			</div>
		`);
	}
}
/****************************************************/
/**设置iframe关闭，缩小事件**/
/***************************************************/
function setClose(){
	$('.close').click(function() {
		$('.iframe-box').fadeOut(300);
		$('.Icon').fadeOut(300);
	});
	//设置iframe缩小事件
	$('.shrink').off('click').click(function () {
		$('.iframe-box').hide(300);
		$('.Icon').fadeIn(300);
	});
}
/****************************************************/
/**更换壁纸**/
/***************************************************/
$('.bg-url').off('change').change(function(){
	console.log(22222);
	var bgSrc = $(this).val();
		bgSrc = bgSrc.slice(bgSrc.lastIndexOf('\\')+1 );
	$('.os-banner').css({
		backgroundImage:'url(../imgage/'+bgSrc+')'
	});
});
/****************************************************/
/**点击缩略图显示iframe**/
/***************************************************/
function showIframe(){
	$('.Icon').click(function () {
		console.log(1);
		$('.iframe-box').show(300);
	});
}
/****************************************************/
/**关闭系统**/
/***************************************************/
function osClose(){

}

