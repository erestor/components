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
	ViewModel.prototype = {
	};

	ko.bindingHandlers._material_carousel = {
		'init': function(element, valueAccessor) {
			var el = $(element),
				frames = el.find('.frame');

			if (!frames.length) {
				//the component template hasn't been injected yet, must wait
				var initFn = arguments.callee;
				setTimeout(function() {
					initFn(element, valueAccessor);
				}, 50);
				return;
			}

			var options = ko.unwrap(valueAccessor());
			options.frameCount(frames.length);

			setTimeout(function() { //wait for DOM update
				var controls = el.find('.control'),
					selection = 0;

				selectFrame(0);

				controls.each(function(index, el) {
					$(el).click(function() {
						if (interval) {
							clearInterval(interval);
							interval = null;
						}
						animateToFrame(index, animations.timing, true);
					});
				});

				var animating = false,
					interval = setInterval(tick, options.interval);

				ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
					clearInterval(interval);
					controls.each(function(el) {
						$(el).off('click');
					});
				});

				//#region Internal functions

				function tick() {
					animateToFrame((selection + 1) % frames.length, animations.carouselTiming);
				}

				function selectFrame(newSelection) {
					$(frames[newSelection]).addClass('selected');
					$(controls[newSelection]).addClass('selected');
					selection = newSelection;
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
			});
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
