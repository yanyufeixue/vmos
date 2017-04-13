/****************************************************/
/**页面加载时调用的函数****/
/***************************************************/
$(function() {
	//调用判断用户信息方法
	checkUserInfo();
});
/****************************************************/
/**功能：判断用户名信息是否正确****/
/***************************************************/
function checkUserInfo(){
	console.log(1);
	$('.submit').click(function(){
		console.log(1);
		//获取用户名
		var userName = $('.user-name').val(),
		//获取密码
			userPwd = $('.user-pwd').val();
		if(userName==='nopen'&&userPwd==='123'){
			location.href='html/os.html';
		}else{
			console.log(userName+'--'+userPwd);
		}
	});
}