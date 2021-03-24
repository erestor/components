define(['text!./material-carousel.html', '../tools/animations'],
function(htmlString, animations) {

	function ViewModel(params) {
		this.frameCount = ko.observable();
		this.interval = params.interval || 10000; //10 seconds by default

		var self = this;
		this.frames = ko.pureComputed(function() {
			return new Array(self.frameCount());
		});
	}

	ko.bindingHandlers._material_carousel = (function() {
		var init = function(element, valueAccessor) {
			var el = $(element),
				options = ko.unwrap(valueAccessor()),
				frames = el.find('.frame');

			if (!frames.length) {
				//the component template hasn't been injected yet, must wait
				setTimeout(function() {
					init(element, valueAccessor);
				}, 50);
				return;
			}
			options.frameCount(frames.length);
			setTimeout(boot); //wait for DOM update before boot
			return;

			function boot() {
				var controls = el.find('.control'),
					stopOnClickFrames = el.find('.stop-on-click'),
					selection = 0,
					animating = false,
					interval;

				controls.each(function(index, el) {
					$(el).click(function() {
						stop();
						animateToFrame(index, animations.timing, true);
					});
				});

				stopOnClickFrames.each(function(index, el) {
					if (!$(el).is('iframe'))
						$(el).click(stop);
					else {
						var listener = window.addEventListener('blur', function() {
							if (document.activeElement === el) {
								stop();
								window.removeEventListener('blur', listener);
							}
						});
					}
				});

				//set up observer to start the carousel spin when it becomes visible
				var observer = new IntersectionObserver(function(entries) {
					entries.forEach(function(entry) {
						if (entry.isIntersecting)
							start();
						else
							stop();
					});
				});
				observer.observe(element);

				ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					observer.unobserve(element);
					stop();
					controls.each(function(el) {
						$(el).off('click');
					});
				});

				selectFrame(0);
				return;

				//#region Internal functions

				function selectFrame(newSelection) {
					$(frames[newSelection]).addClass('selected');
					$(controls[newSelection]).addClass('selected');
					selection = newSelection;
				}

				function start() {
					if (!interval)
						interval = setInterval(tick, options.interval);

					function tick() {
						animateToFrame((selection + 1) % frames.length, animations.carouselTiming);
					}
				}

				function stop() {
					if (interval) {
						clearInterval(interval);
						interval = null;
					}
				}

				function animateToFrame(newSelection, timing, correctDirection) {
					if (selection == newSelection || animating)
						return;

					animating = true;
					var overflowContainer = $(element).addClass('hide-overflow-x');
					$(element).data('selectedTab', newSelection);

					var selectedEl = el.find('.frames > .frame.selected'),
						newSelectedEl = el.find('.frames > .frame:nth-child(' + (newSelection + 1) + ')');

					var selectedElAnimation = animations.slideLeft,
						newSelectionAnimation = animations.slideFromRight;

					if (correctDirection && selection > newSelection) {
						selectedElAnimation = animations.slideRight;
						newSelectionAnimation = animations.slideFromLeft;
					}

					$(controls[selection]).removeClass('selected');
					$(controls[newSelection]).addClass('selected');
					controls.addClass('animating');

					selectedEl.addClass('animating').removeClass('selected');
					var anim1 = selectedEl[0].animate(selectedElAnimation, timing);
					anim1.onfinish = function() {
						selectedEl.removeClass('animating');
					};

					newSelectedEl.addClass('animating selected');
					var anim2 = newSelectedEl[0].animate(newSelectionAnimation, timing);
					anim2.onfinish = function() {
						controls.removeClass('animating');
						newSelectedEl.removeClass('animating');
						overflowContainer.removeClass('hide-overflow-x');
						selection = newSelection;
						animating = false;
					};
				}

				//#endregion
			}
		};
		return {
			'init': init
		};
	})();

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
