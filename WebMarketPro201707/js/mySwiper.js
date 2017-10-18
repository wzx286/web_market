//取整函数, 0~0.2取0, 0.2~1取1
function Round(num){
	if(num > 0.2 && num <= 0.5)
		return 1;
	else if(num < -0.2 && num >= -0.5)
		return -1;
	// else if(num > 0.5)
	// 	return 1;
	// else if(num < -0.5)
	// 	return -1;
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


function BindSwiperNode(node,option){

	let opt = option;
	
	let startPosX,
		startPosY,
		distanceX,
		distanceY,
		loopX,
		loopY,
		vector_x,
		vector_y,
		timer;

	let _index = 0,
		paginationPoint = null;

	let node_wrap = node.getElementsByClassName('mySwiper-wrap')[0];
	node_wrap.transform = node_wrap.transform||{x:0,y:0};
	/*
		初始化
		node为结点对象,
		direction为允许拖动的轴{x:false,y:false},
		bounce为弹性设置,每个块的长宽{x:x_len,y:y_len},
		loop为滑到最末尾时继续滑动是否转回到第一张,
		onceNum为同滑动区域中同时显示的张数,默认为1张,
	*/
	opt.direction = opt.direction || {x:false,y:false};
	opt.onceNum = opt.onceNum || 1;	
	opt.bounce = opt.bounce || {x:opt.direction.x && node.clientWidth/opt.onceNum || node.clientWidth,
	 y:opt.direction.y && node.clientHeight/opt.onceNum || node.clientHeight};
	opt.loop = opt.loop || true;
	opt.prevButton = opt.prevButton || '';
	opt.nextButton = opt.nextButton || '';
	opt.autoPlay = opt.autoPlay || true;
	opt.autoPlayDelay = opt.autoPlayDelay || 2000;
	opt.autoPlayTouchstop = opt.autoPlayTouchstop || true;
	opt.speed = opt.speed || 300;
	opt.pagination = opt.pagination || '';//这里class带'.',如'.active'
	opt.paginationSelectedClassName = opt.paginationSelectedClassName || '';//这里class不带'.',如'active'

	const oSlider = node_wrap.getElementsByClassName('mySwiper-slide');
	const oLen = oSlider.length;
	const nodeWidth = node.offsetWidth,
		nodeHeight = node.offsetHeight;
	const loopXLen = opt.direction.x && (oLen - opt.onceNum + 1) * nodeWidth/opt.onceNum,
		loopYLen = opt.direction.y && (oLen - opt.onceNum + 1) * nodeHeight/opt.onceNum,
		wrapWidth = opt.direction.x && oLen * nodeWidth/opt.onceNum,
		wrapHeight = opt.direction.y && oLen * nodeHeight/opt.onceNum;

	//防止在一些浏览器中使用时,一张图边缘漏出下一张图片的内容
	node.style.width = opt.bounce.x * (opt.direction.x && opt.onceNum || 1) + 'px';
	node.style.height = opt.bounce.y * (opt.direction.y && opt.onceNum || 1) + 'px';

	opt.direction.x && (node_wrap.style.width = wrapWidth +"px");
	opt.direction.y && (node_wrap.style.height = wrapHeight + "px");
	Array.prototype.forEach.call(oSlider,function(el){
		el.style.width = opt.bounce.x + "px";
		el.style.height = opt.bounce.y + "px";
		// el.style.width = node.offsetWidth + "px";		
	});
	// for( let el of oSlider) {
	// 	el.style.width = opt.bounce.x + "px";
	// 	el.style.height = opt.bounce.y + "px";		
	// 	// el.style.width = node.offsetWidth + "px";
	// }
		

	

	(function(){
		if(opt.pagination!=='' && opt.paginationSelectedClassName!==''){//分页区域
			paginationPoint = node.parentNode.querySelector(opt.pagination).getElementsByClassName('mySwiper-pagination-point');
			addClass(paginationPoint[_index],opt.paginationSelectedClassName);
			// for( el of paginationPoint) {
			Array.prototype.forEach.call(paginationPoint,function(el){
				el.addEventListener('mouseenter',function() {
					jumpToThis(paginationPoint,this);
				}.bind(el));
			});
				
			// }
			
		}
		if(opt.autoPlay){
			autoPlay();
		}
		if(opt.prevButton!==''){
			node.parentNode.querySelector(opt.prevButton).addEventListener('click',	function(){
				goToNext(-1);
				autoPlay();
			});
		}
		if(opt.nextButton!==''){
			node.parentNode.querySelector(opt.nextButton).addEventListener('click',function(){
				goToNext(1);
				autoPlay();
			});
		}

	})();

	//给分页器添加的跳转事件
	function jumpToThis(arr,that) {
		const index = Array.prototype.indexOf.call(arr,that);
		index !== _index && ( goToNext(index - _index), autoPlay() ) ;
	}

	//移动一个opt.bounce,dir参数控制方向和格子数(+1为正向,-1为反向,移动一格)
	function goToNext(dir){
		opt.direction.x && (node_wrap.transform.x = (node_wrap.transform.x-dir*opt.bounce.x)%loopXLen);
		opt.direction.y && (node_wrap.transform.y = (node_wrap.transform.y-dir*opt.bounce.y)%loopYLen);

		if(opt.loop){
			//误差矫正:防止node_wrap.transform.x由于相加时小数部分的误差而很接近-loopXLen,导致取余数不为0
			node_wrap.transform.x = node_wrap.transform.x + loopXLen < 0.1 ? 0 : node_wrap.transform.x;
			//误差矫正
			node_wrap.transform.y = node_wrap.transform.y + loopYLen < 0.1 ? 0 : node_wrap.transform.x;	
			//autoplay向左滑动		
			// node_wrap.transform.x = node_wrap.transform.x> 0 ? opt.bounce.x-wrapWidth : node_wrap.transform.x;
			//autoplay向上滑动
			// node_wrap.transform.y = node_wrap.transform.y> 0 ? opt.bounce.y-wrapHeight : node_wrap.transform.y;			
		}else{
			node_wrap.transform.x = node_wrap.transform.x> 0 ? 0 : node_wrap.transform.x;
			node_wrap.transform.y = node_wrap.transform.y> 0 ? 0 : node_wrap.transform.y;		
		}
		node_wrap.style.transform = 'translate3d('+node_wrap.transform.x+'px,'+node_wrap.transform.y+'px,0px)';
		paginationEvent();
	}

	function autoPlay(){
		node_wrap.style.transition = 'transform '+opt.speed/1000 + 's';
		clearInterval(timer);
		timer = setInterval(function(){
			goToNext(1);
		},opt.autoPlayDelay)
	}

	function stop(){
		node_wrap.style.transition ='';
		clearInterval(timer);
	}

	function paginationEvent(){
		_index = Math.abs(node_wrap.transform.x/opt.bounce.x || node_wrap.transform.y/opt.bounce.y);
		_index %= opt.direction.x && wrapWidth || opt.direction.y && wrapHeight;

		if(paginationPoint){			
			Array.prototype.forEach.call(paginationPoint,function(elem,i){
				(i!==_index) &&　removeClass(elem,opt.paginationSelectedClassName) || addClass(elem,opt.paginationSelectedClassName);
			});
		}	
	}

	function touchStart(e){
		e = e || window.event;
		startPosX = e.targetTouches[0].pageX;
		startPosY = e.targetTouches[0].pageY;
		distanceX = 0;
		distanceY = 0;
		opt.autoPlayTouchstop && stop();
	}

	function touchMove(e){
		e = e || window.event;
		if(opt.direction === 'undefined')return;

		opt.direction.x && (distanceX = (e.targetTouches[0].pageX - startPosX));
		opt.direction.y && (distanceY = (e.targetTouches[0].pageY - startPosY));
		
		node_wrap.style.transform = 'translate3d('+(node_wrap.transform.x+distanceX)+'px, '+(node_wrap.transform.y+distanceY)+'px,0px)';
	}

	function touchEnd(e){
		if(!opt.bounce.x || !opt.bounce.y) return;
		vector_y = Round(distanceY/opt.bounce.y)*opt.bounce.y; 
		vector_x = Round(distanceX/opt.bounce.x)*opt.bounce.x;
		if(opt.loop){
			if(opt.direction.x) {
				loopX = (vector_x+node_wrap.transform.x)%loopXLen;
				node_wrap.transform.x = loopX<=0?loopX:opt.bounce.x-loopXLen;
			}
			if (opt.direction.y) {
				loopY =  (vector_y+node_wrap.transform.y)%loopYLen;
				node_wrap.transform.y = loopY<=0?loopY:opt.bounce.y-loopYLen;
			}
		}else if(opt.direction.x && node_wrap.transform.x+vector_x<=0 && node_wrap.transform.x+vector_x-opt.bounce.x>=-wrapWidth){
			node_wrap.transform.x += vector_x;
		}else if(opt.direction.y && node_wrap.transform.y+vector_y<=0 && node_wrap.transform.y+vector_y-opt.bounce.y>=wrapHeight){
			node_wrap.transform.y += vector_y;
		}

		autoPlay();
		node_wrap.style.transform = 'translate3d('+(node_wrap.transform.x)+'px,'+(node_wrap.transform.y)+'px,0px)';
		paginationEvent();
	}

	node_wrap.addEventListener('touchstart',touchStart);
	node_wrap.addEventListener('touchmove',touchMove);
	node_wrap.addEventListener('touchend',touchEnd);	


}