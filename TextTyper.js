// todo: 如何能让打字效果更真实些，比如在标点符号处多停顿一些。
//       或者说一个词一个词地显示，而不是一个字一个字。
var TextTyper = (function () {
	var sound = document.getElementById("keyboard_sound"),
		paused = false;

	function pauseSound() {
		sound.pause();
	}

	function playSound() {
		if (sound.paused) {
			sound.play();
		}
	}

	function pause() {
		paused = true;
	}

	function print(ele, paras, speed) {
		var pCount = 0,
			pNum = paras.length;

		speed = speed || 200;
		typeNextParagraph();

		function typeNextParagraph() {
			if (pCount >= pNum) {
				return;
			} else {
				typeOneParagraph(paras[pCount++], typeNextParagraph);
			}
		}

		function typeOneParagraph(para, onFinish) {
			var p = document.createElement("p"),
				charCount = 0,
				len = para.length;
			ele.appendChild(p);
			
			var t = setInterval(function () {
				if (paused || charCount >= len) {
					clearInterval(t);
					pauseSound();
					onFinish && onFinish();
				} else {
					playSound();
					p.innerHTML = para.substr(0, ++charCount);
					p.scrollIntoView();
				}
			}, speed);
		}
	}

	return {
		print: print,
		pause: pause
	};
})();