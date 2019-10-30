$(function() {

	//歌的id
	var songId = [];

	//歌的详情
	var songsDetail = [];

	//获取音频标签
	var audio = $('#audio')[0];

	//音频链接
	var url = 'https://music.163.com/song/media/outer/url?id=';

	//本地存储歌曲数据
	var da = localStorage.songs;

	//当前时间总时长
	var durtime = 0;

	//当前播放的进度时间
	var curtime = 0;

	//进度条的w
	var pro = $(".prog")[0];
	var progw = pro.offsetWidth;

	//小圆块的w
	var $mask = $(".mask");
	var maskw = $mask[0].offsetWidth;

	//判断播放是否有点击
	//	var clipp = false;

	//歌曲列表的li
	var songlis = null;

	//音乐播放
	audio.oncanplay = function() {
		this.play();
		//		$lithis.siblings().find(".l-time").find("span")

		$line.find("span").css({
			animationPlayState: "running",
		})
		//		console.log(this);
		//当前歌曲总时长
		durtime = this.duration * 1000;
		$(".end").text(minsec(durtime));
		$(".s-name>span").text($lithis.find(".ge").text() + "-" + $lithis.find(".m").text())
	}

	//播放完成
	audio.onended = function() {
		console.log('播放完成');
		$line.find("span").css({
			animationPlayState: "paused",
		})
		$(".control-btn>.pp").css({
			background: "url('./img/p-play.png')",
			backgroundSize: 'contain'
		})
		
		
		//获取播放模式
		var val = $(".control-btn>.suiji").data("val");
		console.log(val);

		if(val == 2) {
			if(lindex == songlis.length) {
				lindex = 0;
			} else {
				++lindex;
			}

		} else if(val == 1){
			lindex = lindex;
			
		}else{
			var lindexpp = lindex;
			lindex11 = Math.floor(Math.random() * songlis.length);

			function norep(lindexpp, lindex11) {
				if(lindexpp == lindex11) {
					lindex11 = Math.floor(Math.random() * songlis.length);
					return norep(lindexpp, lindex11);
				}
				return lindex11;
			}

			lindex = norep(lindexpp, lindex11);
		}

		//当前下一首的歌曲
		$lithis = songlis.eq(lindex);
		//获取当前下一首的歌曲的id
		var id = $lithis.data("id");

		$line = $lithis.find($(".line"));

		//将当前下一首个歌曲的在播放
		$lithis.data("play", 1);

		if($lithis.data("play") == 0) {
			audio.pause();
			$lithis.data("play", 1);
			$line.find("span").css({
				animationPlayState: "paused",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-play.png')",
				backgroundSize: 'contain'
			})

		} else {
			audio.play();
			$lithis.data("play", 0);
			$line.find("span").css({
				animationPlayState: "running",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-pause.png')",
				backgroundSize: 'contain'
			})
		}

		$lithis.siblings().find(".l-time").find("span").css({
			animationPlayState: "paused",
		})

		audio.src = url + id;		
	}

	//监听音频实时变化
	audio.ontimeupdate = function() {

		//当前播放的进度时间
		curtime = this.currentTime * 1000;
		$(".home").text(minsec(curtime));

		//小圆块的实时移动的距离
		var x = curtime * (progw - maskw) / durtime;

		$mask.css({
			left: x + "px"
		})

		$(".prog-act").css({
			width: x + maskw / 2 + "px"
		})

	}

	if(da) {
		da = JSON.parse(da);
		console.log("da", da);
		//保存歌曲详情
		songsDetail = da.playlist.tracks.concat();

		for(var i = 0; i < da.privileges.length; i++) {
			//保存歌曲songId
			songId.push(da.privileges[i].id);

			//本地歌曲的数量
			$(".loc-num").text(songId.length);

		}

	} else {
		$.ajax({
			type: "get",
			url: "http://www.arthurdon.top:3000/top/list?idx=1",
			success: function(data) {
				console.log(data);

				localStorage.setItem("songs", JSON.stringify(data));

				for(var i = 0; i < data.privileges.length; i++) {
					//保存歌曲songId
					songId.push(data.privileges[i].id);
					//保存歌曲详情
					songsDetail.push(data.playlist.tracks[i]);

					//本地歌曲的数量
					$(".loc-num").text(songId.length);

				}
			}
		});
	}

	//移动时小圆块移动的距离
	var clix0 = 0;

	//进度条距左边的距离
	var progleft = pro.offsetLeft;

	//点击进度条，移动小圆块
	$(".prog>.layer").on("touchstart", function(e) {

		//进度条距左边的距离
		var progleft = pro.offsetLeft;
		//小圆块移动的距离
		var clix = e.touches[0].pageX - progleft - maskw / 2;

		clix = clix <= 0 ? 0 : clix < (progw - maskw) ? clix : (progw - maskw);

		if($lithis != null) {
			clix0 = clix;

			$(".control-btn>.pp").css({
				background: "url('./img/p-pause.png')",
				backgroundSize: 'contain'
			})
			if($lithis != null) {
				$lithis.data("play", 0);
			}
		}
//		$mask.css({
//			left:clix + "px"
//		})
//		$(".prog-act").css({
//			width: clix + maskw/2 + "px"
//		})

		//当前播放时间
//		audio.currentTime = (clix * durtime / (progw - maskw))/1000;
	})

	//移动进度条
	$(".prog>.layer").on("touchmove", function(e) {

		//小圆块移动的距离
		var clix = e.touches[0].pageX - progleft - maskw / 2;

		clix = clix <= 0 ? 0 : clix < (progw - maskw) ? clix : (progw - maskw);

		clix0 = clix;
		$mask.css({
			left: clix + "px"
		})
		$(".prog-act").css({
			width: clix + maskw / 2 + "px"
		})

//		//当前播放时间
//		audio.currentTime = (clix * durtime / (progw - maskw))/1000;
	})

	//移动松开时
	$(".prog>.layer").on("touchend", function(e) {
		$mask.css({
			left: clix0 + "px"
		})
		$(".prog-act").css({
			width: clix0 + maskw / 2 + "px"
		})
		audio.currentTime = (clix0 * durtime / (progw - maskw)) / 1000;

	})

	var $line = null;

	var $lithis = null;

	//点击li的标记
	var lindex = null;

	//点击歌曲列表
	$(".song-list").on("click", "li", function() {
		$lithis = $(this);
		//		lindex = $($lithis).index();

		$line = $lithis.find($(".line"));

		//当前播放的li的标记
		lindex = $lithis.index();

		//	if(!$lithis.hasClass("con")){
		//		let licon = $(".song-list li.con");
		//		if(licon.length>0){
		//			console.log(licon.data("play"));
		//			if(licon.data("play",1)){
		//				$line.find("span").css({
		//					animationPlayState: "paused",
		//				})
		//			}
		//			licon.removeClass("con");
		//		}
		//	}

		//		$lithis.addClass("con");

		//当前歌曲的歌手名字和歌名
		//		$(".s-name>span").text($lithis.find(".ge").text()+"-"+$lithis.find(".m").text())

		$(".control-btn>.pp").css({
			background: "url('./img/p-pause.png')",
			backgroundSize: 'contain'
		})

		//点击的歌曲id
		let id = $lithis.data("id");

		//播放是否为同一首,0--播放，1--停止
		if($(audio).data("id") == id) {
			if($lithis.data("play") == 0) {
				audio.pause();
				$lithis.data("play", 1);
				$line.find("span").css({
					animationPlayState: "paused",
				})

				$(".control-btn>.pp").css({
					background: "url('./img/p-play.png')",
					backgroundSize: 'contain'
				})

			} else {
				audio.play();
				$lithis.data("play", 0);
				$line.find("span").css({
					animationPlayState: "running",
				})

				$(".control-btn>.pp").css({
					background: "url('./img/p-pause.png')",
					backgroundSize: 'contain'
				})
			}

		} else {
			//当前播放的歌曲id
			$lithis.siblings().find(".l-time").find("span").css({
				animationPlayState: "paused",
			})
			$(audio).data("id", id);
			audio.src = url + id;
		}

	})

	//当前展示15首歌
	var previewId = [];
	var startMark = 0;
	var endMark = 15;
	console.log("songsDetail", songsDetail);
	console.log("songId", songId);

	//处理歌曲时间
	function minsec(time) {
		var second = Math.floor(time / 1000 % 60);
		second = second >= 10 ? second : '0' + second;
		var minute = Math.floor(time / 1000 / 60);
		minute = minute >= 10 ? minute : '0' + minute;

		return minute + ':' + second;
	}

	//首页进入列表页
	$(".loc").on("click", function() {
		$(".page-index").hide();
		$(".page-list").show();

		//初始化15首歌
		if(previewId == 0) {
			previewId = previewId.concat(songId.slice(startMark, endMark));

			startMark = endMark;
			endMark += endMark;
		}

		for(var i = 0; i < previewId.length; i++) {

			//获取歌手名字
			var sm = [];
			for(let k = 0; k < songsDetail[i].ar.length; k++) {
				sm.push(songsDetail[i].ar[k].name);
			}

			var listr = `
				<li data-id = "${songsDetail[i].id}" data-play = "0" class="clearfix">
					<div class="cir fl">
						<img src="${songsDetail[i].al.picUrl}"/>
					</div>
					<div class="gem fl">
						<span class="ge">${songsDetail[i].name}</span>
						<span class="m">${sm.join(" / ")}</span>
					</div>
					<div class="l-time fr">
						<div class="dt">${minsec(songsDetail[i].dt)}</div>
						<div class="line">
							<span class="line-1"></span>
							<span class="line-2"></span>
							<span class="line-1"></span>
							<span class="line-2"></span>
						</div>
					</div>
				</li>`;

			$(".song-list>ul").append(listr);

		}
		songlis = $(".song-list>ul>li");
	})

	//控制按钮暂停播放
	$(".control-btn>.pp").on("click", function() {

		if($lithis == null) {
			return;
		}
		if($lithis.data("play") == 0) {
			audio.pause();
			$lithis.data("play", 1);
			$line.find("span").css({
				animationPlayState: "paused",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-play.png')",
				backgroundSize: 'contain'
			})

		} else {
			audio.play();
			$lithis.data("play", 0);
			$line.find("span").css({
				animationPlayState: "running",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-pause.png')",
				backgroundSize: 'contain'
			})
		}
	})

	//播放模式   <!-- 1: 单曲循环，2：列表循环 ，3：随机播放 -->
	$(".control-btn>.suiji").on("click", function() {

		var $this = $(this);
		var min = $this.data("min");
		var val = $this.data("val");
		//var max = $this.data("max");

		if(val == $this.data("max")) {
			val = min;
			$this.data("val", min);
		} else {
			$this.data("val", ++val);
		}

		$(this).css({
			background: "url('./img/p-" + val + ".png') no-repeat center center",
			backgroundSize: 'contain'
		})
	})

	//上一首
	$(".control-btn>.pre").on("click", function() {
		if($lithis == null) {
			return;
		}

		//songlis:歌曲列表li

		//获取播放模式
		var val = $(".control-btn>.suiji").data("val");

		if(val == 1 || val == 2) {

			if(lindex == 0) {
				lindex = songlis.length - 1;
			} else {
				--lindex;
			}

		} else {
			var lindexpp = lindex;
			lindex11 = Math.floor(Math.random() * songlis.length);

			function norep(lindexpp, lindex11) {
				if(lindexpp == lindex11) {
					lindex11 = Math.floor(Math.random() * songlis.length);
					return norep(lindexpp, lindex11);
				}
				return lindex11;
			}

			lindex = norep(lindexpp, lindex11);
		}

		//当前下一首的歌曲
		$lithis = songlis.eq(lindex);
		//获取当前下一首的歌曲的id
		var id = $lithis.data("id");

		$line = $lithis.find($(".line"));

		//将当前下一首个歌曲的在播放
		$lithis.data("play", 1);

		if($lithis.data("play") == 0) {
			audio.pause();
			$lithis.data("play", 1);
			$line.find("span").css({
				animationPlayState: "paused",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-play.png')",
				backgroundSize: 'contain'
			})

		} else {
			audio.play();
			$lithis.data("play", 0);
			$line.find("span").css({
				animationPlayState: "running",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-pause.png')",
				backgroundSize: 'contain'
			})
		}

		$lithis.siblings().find(".l-time").find("span").css({
			animationPlayState: "paused",
		})

		audio.src = url + id;
	})

	//下一首
	$(".control-btn>.next").on("click", function() {
		if($lithis == null) {
			return;
		}

		//songlis:歌曲列表li

		//获取播放模式
		var val = $(".control-btn>.suiji").data("val");
		console.log(val);

		if(val == 1 || val == 2) {

			if(lindex == songlis.length) {
				lindex = 0;
			} else {
				++lindex;
			}

		} else {
			var lindexpp = lindex;
			lindex11 = Math.floor(Math.random() * songlis.length);

			function norep(lindexpp, lindex11) {
				if(lindexpp == lindex11) {
					lindex11 = Math.floor(Math.random() * songlis.length);
					return norep(lindexpp, lindex11);
				}
				return lindex11;
			}

			lindex = norep(lindexpp, lindex11);
		}

		//当前下一首的歌曲
		$lithis = songlis.eq(lindex);
		//获取当前下一首的歌曲的id
		var id = $lithis.data("id");

		$line = $lithis.find($(".line"));

		//将当前下一首个歌曲的在播放
		$lithis.data("play", 1);

		if($lithis.data("play") == 0) {
			audio.pause();
			$lithis.data("play", 1);
			$line.find("span").css({
				animationPlayState: "paused",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-play.png')",
				backgroundSize: 'contain'
			})

		} else {
			audio.play();
			$lithis.data("play", 0);
			$line.find("span").css({
				animationPlayState: "running",
			})

			$(".control-btn>.pp").css({
				background: "url('./img/p-pause.png')",
				backgroundSize: 'contain'
			})
		}

		$lithis.siblings().find(".l-time").find("span").css({
			animationPlayState: "paused",
		})

		audio.src = url + id;
	})

	//列表页返回首页
	$(".sort-title>span").on("click", function() {
		$(".page-index").show();
		$(".page-list").hide();

	})

	$(".s-name").on("click",function () {
		$(".page-list").hide();
		$(".page-word").show();
		
//		$(".title").text($lithis.find(".ge").text());
//		($lithis.find(".ge").text() + "-" + $lithis.find(".m").text())
	})
	$(".page-word .back").on("click",function () {
		
		$(".page-list").show();
		$(".page-word").hide();
	})
		
})