(function () {
	const notch = document.querySelector('.notch');
	if (notch == null)
		return;
	
	const posts = document
		.querySelectorAll('.page');
	let portrait = isPortrait();

	window.addEventListener('resize', function () {
		let scopedPortrait = isPortrait();
		if (scopedPortrait === portrait)
			return;

		portrait = scopedPortrait;
		if (portrait) {
			for (let i = 0; i < posts.length; ++i)
				posts[i].style.paddingLeft = '0px';
		}
		else {
			indentPage();
		}
	}, false);

	window.addEventListener('scroll', function (ev) {
		if (portrait) //only landscape
			return;

		indentPage();
	});

	function isPortrait() {
		//check by media query
		return !window.matchMedia("(min-width: 768px)").matches;
		//check by size
		//return window.innerHeight > window.innerWidth;
	}

	function indentPage() {
		const notchHeight = notch.offsetHeight;
		const notchWidth = notch.offsetWidth;
		const notchRect = notch.getBoundingClientRect();
		const indent = notchWidth - 30;
		const treshold = 25;

		function computeIndent(val, isTop) {
			const scale = (val + treshold) / (treshold * 2);
			return isTop
				? indent * scale
				: indent * (1 - scale);
		}

		const windowsHeight = window.innerHeight;

		for (let i = 0; i < posts.length; ++i) {
			const post = posts[i];

			const postRect = post.getBoundingClientRect();
			const botDist = postRect.top - notchRect.bottom;
			const topDist = postRect.bottom - notchRect.top;

			if (Math.abs(topDist) < treshold) {
				post.style.paddingLeft = computeIndent(topDist, true) + 'px';
			}
			else if (topDist >= 0 && Math.abs(botDist) >= treshold && botDist <= 0) {
				post.style.paddingLeft = indent + 'px';
			}
			else if (Math.abs(botDist) < treshold) {
				post.style.paddingLeft = computeIndent(botDist, false) + 'px';
			}
			else {
				post.style.paddingLeft = '0px';
			}
		}
	}

	if (!portrait)
		indentPage();
}());