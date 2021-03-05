define([], function() {
	return {
		carouselTiming: {
			duration: 1000,
			easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' //ease-out-cubic
		},
		timing: {
			duration: 375,
			easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' //ease-out-cubic
		},
		$timing: {
			duration: 375,
			easing: 'easeOutCubic'
		},
		slideLeft: [
			{ transform: 'none' },
			{ transform: 'translateX(-100%)' }
		],
		slideFromRight: [
			{ transform: 'translateX(100%)' },
			{ transform: 'none' }
		],
		slideRight: [
			{ transform: 'none' },
			{ transform: 'translateX(100%)' }
		],
		slideFromLeft: [
			{ transform: 'translateX(-100%)' },
			{ transform: 'none' }
		]
	};
});
