var angle=0;
var loop=0;

function FanRotate(){
	loop=loop||setInterval(function(){
		angle+=2;
		$('.fan').rotate(angle);
	},1000/60);
}

$('#myApp4').mouseover(function(){
	FanRotate();	
});

$('#myApp4').mouseout(function(){
	clearInterval(loop);
	loop=0;
});