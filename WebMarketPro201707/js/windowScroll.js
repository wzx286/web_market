
var CurPos1,CurPos2,t1,t2;
var DoJumpUp=function(){
	t1=setInterval("GoTop()",1);
}

var DoJumpDown=function(){	
	t2=setInterval("GoBottom()",1);
}

var GoTop=function(){
	CurPos1=document.documentElement.scrollTop||document.body.scrollTop;
	CurPos1-=20;
	if(CurPos1>0){
		window.scrollTo(0,CurPos1);
	}
	else{
		window.scrollTo(0,0);
		clearInterval(t1);
	}
};


var GoBottom=function(){
	
	CurPos2=document.documentElement.scrollTop||document.body.scrollTop;
	CurPos2+=10;
	if(CurPos2<document.body.scrollHeight-document.documentElement.clientHeight){
		window.scrollTo(0,CurPos2);
	}
	else{
		window.scrollTo(0,document.body.scrollHeight-document.documentElement.clientHeight);
		clearInterval(t2);
	}
}

var RankBy=function(str){
	var appL=document.querySelector('[ng-controller=myctrl]');
	var scope=angular.element(appL).scope();
	switch(str){
		case '升序':scope.order="name";break;
		case '降序':scope.order="-name";break;
		case '从新到旧':scope.order="id";break;
		case '从旧到新':scope.order="-id";break;
		case '从高到低':scope.order="-price";break;
		case '从低到高':scope.order="price";break;
		default:break;
	}
	scope.$apply();
};

$('.drop-items-hide>li').click(function(e){
	var value = $(this).html();
	RankBy(value);
})

$('.dropToggle').click(function(){
	var node = $(this).children('ul');
	if(node.css('display')==='none'){
		node.slideDown().parent().siblings().children('ul').fadeOut();
	}
	else 
		node.fadeOut();			
});


		
