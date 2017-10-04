var paneLen,btnLen;
$(function(){
	var deviceWidth = document.body.clientWidth;
	var fontSize = deviceWidth/12.23;
	document.getElementsByTagName('html')[0].style.fontSize = fontSize+'px';
	document.body.style.fontSize = 0.12*fontSize+'px';
	if(deviceWidth<=640){
		var usrinfo = $('.usrinfo');
		var navb = $('.navb');
		var org = usrinfo.get(0).offsetHeight + navb.get(0).offsetHeight;
		var pre = document.body.scrollTop;
		var cur ;
		document.addEventListener('scroll',function(e){
			cur = document.body.scrollTop;
			(cur > org/2 && pre<cur-5) && (usrinfo.slideUp() && navb.slideUp());	
			(pre>cur+10||cur <= org/2)&&(usrinfo.slideDown() && navb.slideDown());
			pre = cur;
		},{passive:true});
	}
	
});



$('.option-case').click(function(){
	paneLen = $('.contain-p')[0].offsetWidth;
	if(paneLen>640){
		btnLen = 100;
	}else{
		btnLen = paneLen/3;
	}
	let inx=$(this).index('.option-case');
	$('.pane-p').css({transform:'translateX(-'+(inx*paneLen)+'px)'});
	$('.select-bar1 .bottom-bar').css({transform:'translateX('+inx*btnLen+'px) translateZ(0px)'});
	$(this).addClass('w-active').siblings().removeClass('w-active');
});

$('.w-pic-pre').click(function(){
	$('.w-pic-show>img').get(0).src=$(this).find('img').get(0).src;
	$(this).addClass('w-pic-active').siblings().removeClass('w-pic-active');
})

