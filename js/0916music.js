$(function() {
	var $mask = $('.mask');
	var maskWidth = $mask.width();

	//获取未激活进度条宽度
	var progressWidth = $('.progress').width();

	//滑块移动范围
	var minLeft = 0;
	var maxLeft = progressWidth - maskWidth;

	var $layer = $('.layer');

	//滑块移动
	function move(e) {
		//获取触碰屏幕X坐标
		var x = e.targetTouches[0].pageX;

		//获取当前元素距离屏幕最左端的距离
		var offsetLeft = $(this).offset().left;

		var left = x - offsetLeft - maskWidth / 2;

		left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;

		$mask.css({
			left: left + 'px'
		})

		//激活进度条的宽度
		var w = x - offsetLeft;
		w = w >= progressWidth ? progressWidth : w <= 0 ? 0 : w;
		$('.progress-active').css({
			width: w + 'px'
		})
	}

	//开始触碰屏幕
	$layer.on('touchstart', function(e) {
		// console.log('e ==> ', e);

		move.call(this, e);
	})

	//触碰移动
	$layer.on('touchmove', function(e) {
		// console.log(e);
		move.call(this, e);
	})
	
	
})