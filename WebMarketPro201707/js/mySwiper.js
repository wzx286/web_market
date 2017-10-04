//取整函数, 0~0.2取0, 0.2~1取1
function Round(num){
	if(num > 0.2 && num <= 0.5)
		return 1;
	else if(num < -0.2 && num >= -0.5)
		return -1;
	else 
		return Math.round(num);
}
function hasClass(obj,className){
	return obj.className.indexOf(className) !== -1;
}
function addClass(obj,className){
	(!hasClass(obj,className))&&(obj.className += ' '+className);
	return true;
}
function removeClass(obj,className){
	hasClass(obj,className)&&(obj.className = obj.className.replace(new RegExp('(\s|^)*'+className,'i'),''));
	return true;
}


function BindSwiperNode(node,option){//direction,bounce,loop

	var opt = option;
	
	var startPosX,
		startPosY,
		distanceX,
		distanceY,
		loopX,
		loopY,
		vector_x,
		vector_y,
		paginationPoint,
		timer;

	var _index = 0,
		paginationPoint = null;

	var node_wrap = node.getElementsByClassName('mySwiper-wrap')[0];
	node_wrap.transform = node_wrap.transform||{x:0,y:0};
	/*初始化
	node为结点对象,
	direction为允许拖动的轴{x:true,y:true},
	bounce为弹性设置,每个块的长宽{x:x_len,y:y_len},某方向的回弹的条件为未超过该方向的一半
	loop为滑到最末尾时继续滑动是否转回到第一张*/
	opt.direction = opt.direction || {x:true,y:true};
	opt.bounce = opt.bounce || {x:node_wrap.getElementsByClassName('mySwiper-slide')[0].offsetWidth,y:node_wrap.offsetHeight};
	opt.loop = opt.loop || true;
	opt.prevButton = opt.prevButton || '';
	opt.nextButton = opt.nextButton || '';
	opt.autoplay = opt.autoplay || true;
	opt.autoplayDelay = opt.autoplayDelay || 2000;
	opt.autoplayTouchStop = opt.autoplayTouchStop || true;
	opt.speed = opt.speed || 300;
	opt.pagination = opt.pagination || '';//这里class带'.',如'.active'
	opt.paginationSelectedClassName = opt.paginationSelectedClassName || '';//这里class不带'.',如'active'

	(function(){
		if(opt.pagination!=='' & opt.paginationSelectedClassName!==''){//分页区域
			paginationPoint = node.parentNode.querySelector(opt.pagination).getElementsByClassName('mySwiper-pagination-point');
			addClass(paginationPoint[_index],opt.paginationSelectedClassName);
		}
		if(opt.autoplay){
			AutoPlay();
		}
		if(opt.prevButton!==''){
			node.parentNode.querySelector(opt.prevButton).addEventListener('click',	function(){
				GoToNext(-1);
				AutoPlay();
			});
		}
		if(opt.nextButton!==''){
			node.parentNode.querySelector(opt.nextButton).addEventListener('click',function(){
				GoToNext(1);
				AutoPlay();
			});
		}

	})();

	//移动一个opt.bounce,dir参数控制方向和格子数(+1为正向,-1为反向,移动一格)
	function GoToNext(dir){
		opt.direction.x && (node_wrap.transform.x = (node_wrap.transform.x-dir*opt.bounce.x)%node_wrap.offsetWidth);
		opt.direction.y && (node_wrap.transform.y = (node_wrap.transform.y-dir*opt.bounce.y)%node_wrap.offsetHeight);
		if(opt.loop){
			node_wrap.transform.x = node_wrap.transform.x> 0 ? opt.bounce.x-node_wrap.offsetWidth : node_wrap.transform.x;
			node_wrap.transform.y = node_wrap.transform.y> 0 ? opt.bounce.y-node_wrap.offsetHeight : node_wrap.transform.y;			
		}else{
			node_wrap.transform.x = node_wrap.transform.x> 0 ? 0 : node_wrap.transform.x;
			node_wrap.transform.y = node_wrap.transform.y> 0 ? 0 : node_wrap.transform.y;		
		}
		node_wrap.style.transform = 'translate3d('+node_wrap.transform.x+'px,'+node_wrap.transform.y+'px,0px)';
		PaginationEvent();
	}

	function AutoPlay(){
		node_wrap.style.transition = 'transform '+opt.speed/1000 + 's';
		clearInterval(timer);
		timer = setInterval(function(){
			GoToNext(1);
		},opt.autoplayDelay)
	}

	function Stop(){
		node_wrap.style.transition ='';
		clearInterval(timer);
	}

	function PaginationEvent(){
		_index = Math.abs(node_wrap.transform.x/opt.bounce.x || node_wrap.transform.y/opt.bounce.y);
		_index %= opt.direction.x && node_wrap.offsetWidth || opt.direction.y && node_wrap.offsetHeight;

		if(paginationPoint){			
			Array.prototype.forEach.call(paginationPoint,function(elem,i){
				(i!==_index) &&　removeClass(elem,opt.paginationSelectedClassName) || addClass(elem,opt.paginationSelectedClassName);
			});
		}	
	}

	function TouchStart(e){
		e = e || window.event;
		startPosX = e.targetTouches[0].pageX;
		startPosY = e.targetTouches[0].pageY;
		distanceX = 0;
		distanceY = 0;
		opt.autoplayTouchStop && Stop();
	}

	function TouchMove(e){
		e = e || window.event;
		if(opt.direction === 'undefined')return;

		opt.direction.x && (distanceX = (e.targetTouches[0].pageX - startPosX));
		opt.direction.y && (distanceY = (e.targetTouches[0].pageY - startPosY));
		
		node_wrap.style.transform = 'translate3d('+(node_wrap.transform.x+distanceX)+'px, '+(node_wrap.transform.y+distanceY)+'px,0px)';
	}

	function TouchEnd(e){
		if(opt.bounce === 'undefined') return;
		vector_y = Round(distanceY/opt.bounce.y)*opt.bounce.y; 
		vector_x = Round(distanceX/opt.bounce.x)*opt.bounce.x;
		if(opt.loop){
			if(opt.direction.x) {
				loopX = (vector_x+node_wrap.transform.x)%node_wrap.offsetWidth;
				node_wrap.transform.x = loopX<=0?loopX:opt.bounce.x-node_wrap.offsetWidth;
			}
			if (opt.direction.y) {
				loopY =  (vector_y+node_wrap.transform.y)%node_wrap.offsetHeight;
				node_wrap.transform.y = loopY<=0?loopY:opt.bounce.y-node_wrap.offsetHeight;
			}
		}else if(opt.direction.x & node_wrap.transform.x+vector_x<=0 & node_wrap.transform.x+vector_x-opt.bounce.x>=-node_wrap.offsetWidth){
			node_wrap.transform.x += vector_x;
		}else if(opt.direction.y & node_wrap.transform.y+vector_y<=0 & node_wrap.transform.y+vector_y-opt.bounce.y>=node_wrap.offsetHeight){
			node_wrap.transform.y += vector_y;
		}

		AutoPlay();
		node_wrap.style.transform = 'translate3d('+(node_wrap.transform.x)+'px,'+(node_wrap.transform.y)+'px,0px)';
		PaginationEvent();
	}

	node_wrap.addEventListener('touchstart',TouchStart);
	node_wrap.addEventListener('touchmove',TouchMove);
	node_wrap.addEventListener('touchend',TouchEnd);


}