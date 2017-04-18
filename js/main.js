function initCarousel (carousel,itemClass,animTime,intervalTime,callBack) {
	var curContext = this;
	this.banners = carousel.querySelectorAll(itemClass);
	this.animTime = animTime? animTime : 300;
	this.intervalTime = intervalTime?intervalTime: 2000;
	this.animteFlag = false
	this.animateNext = animateNext;
	this.goNext = goNext;
	this.goPre = goPre;
	this.cancleAnimate = cancleAnimate;
	this.initTimeout = initTimeout;
	this.addListen = addListen;
	this.currentIndex = 0
	this.cancleAnimate = cancleAnimate

	var timeId,moveListeners  = callBack?[callBack] : [];

	for (var i = 0; i < this.banners.length; i++) {
		if (i != curContext.currentIndex) {
			this.banners[i].style.transform = 'translate3d('+ this.banners[i].offsetWidth +'px,0,0)' ;
		}
	}

	function initTimeout () {
		if (timeId) {
			clearTimeout(timeId)
		}
		timeId = setTimeout(function () {
			animateNext(getNextIndex());
			curContext.timeId = initTimeout();
		}, curContext.intervalTime);
		return timeId;
	}

	function cancleAnimate () {
		if (timeId) {
			clearTimeout(timeId);
			timeId = null;
		}
	}

	function addListen (handler) {
		moveListeners.push(handler);
	}

	function goNext () {
		cancleAnimate()
		animateNext(getNextIndex());
	}

	function goPre () {
		cancleAnimate()
		animateNext(getPreIndex(),true)
	}

	function animateNext (nextIndex,right) {
		if (curContext.animteFlag) {
			return;
		}
		var nextElement = curContext.banners[nextIndex],curElement = curContext.banners[curContext.currentIndex];
		nextElement.style.transition = 'all 0ms';
		nextElement.style.transform = 'translate3d('+ (right?'-':'') +curContext.banners[curContext.currentIndex].offsetWidth +'px,0,0)' ;

		curElement.style.transition = 'all '+curContext.animTime+'ms linear';
		curElement.style.transform = 'translate3d('+ (right?'':'-')+ curContext.banners[curContext.currentIndex].offsetWidth +'px,0,0)' ;
		nextElement.style.transition = 'all '+curContext.animTime+'ms linear';
		nextElement.style.transform = 'translate3d(0,0,0)' ;
		nextElement.addEventListener('transitionend', animationCb, false);
		nextElement.addEventListener('webkitTransitionEnd', animationCb, false);
		curContext.animteFlag = true;
	}

	function animationCb (event) {
		for (var i = 0; i < curContext.banners.length; i++) {
			if(curContext.banners[i] == event.target){
				var targetIndex = i;
				curContext.currentIndex = targetIndex;
				break;
			}
		}
		event.target.removeEventListener('transitionend', animationCb, false);
		event.target.removeEventListener('webkitTransitionEnd', animationCb, false);
		curContext.animteFlag = false;
		for (var i = 0; i < moveListeners.length; i++) {
			moveListeners[i](curContext.currentIndex)
		}
		if (!timeId) {
			initTimeout();
		}
	}

	function getPreIndex () {
		return curContext.currentIndex <= 0 ? this.banners.length :curContext.currentIndex - 1;
	}

	function getNextIndex () {
		return curContext.currentIndex >= curContext.banners.length-1 ? 0 : curContext.currentIndex + 1;
	}

	initTimeout()
}

var carousel = new initCarousel(document.querySelector('.carousel-list'),'.list-item');
var leftArrow = document.querySelector('.left-arrow');
var rightArrow = document.querySelector('.right-arrow');
leftArrow.addEventListener('click',function (event) {
	carousel.goPre();
	event.stopPropagation();
	event.preventDefault();
},false)
rightArrow.addEventListener('click',function (event) {
	carousel.goNext();
	event.stopPropagation();
	event.preventDefault();
},false)
initControls(carousel)

function initControls (carousel) {
	var controls = document.querySelectorAll('.control-list .control');
	for (var i = 0; i < controls.length; i++) {
		var controlItem = controls[i];
		controlItem.addEventListener('click',function (event) {
			var checkIndex = 0;
			for (var i = 0; i < controls.length; i++) {
				if (controls[i] == event.target) {
					checkIndex = i;
					break;
				}
			}
			if (carousel.currentIndex == checkIndex) {
				return;
			}
			carousel.cancleAnimate();
			carousel.animateNext(checkIndex,checkIndex < carousel.currentIndex);
			checkItem(checkIndex);
			event.stopPropagation();
			event.preventDefault();
		},false)
	}

	carousel.addListen(checkItem);

	function checkItem (index) {
		removeClassJJ(document.querySelector('.control-list .control.on'),'on')
		addClassJJ(controls[index],'on')
	}
}

function addClassJJ (ele,className) {
	var eleClassName = ele.className;
	var reg = new RegExp('(^|\\s)'+className+'($|\\s)')
	if (!reg.test(eleClassName)) {
		ele.className = eleClassName + ' '+className;
	}
}
function removeClassJJ (ele,className) {
	var eleClassName = ele.className;
	var reg = new RegExp('(^|\\s)'+className+'($|\\s)')
	if (reg.test(eleClassName)) {
		ele.className = eleClassName.replace(reg, ' ')
	}
}

