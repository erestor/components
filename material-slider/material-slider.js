define(['text!./material-slider.html', '../tools/tools', '@material/slider'],
function(htmlString, tools, materialSlider) {

	const MaterialSlider = function(params) {
		this.min = params.min || 0;
		this.max = params.max || 100;
		this.step = params.step || 1;
		this.discrete = !params.continuous;
		this.value = params.value;
		this.enable = tools.readEnableStatus(params);

		this.label = !params.label ? null : ko.pureComputed(() => {
			var txt = ko.unwrap(params.label);
			var value = ko.unwrap(this.value);
			var valueDesc = typeof params.valueDesc == 'function' ? params.valueDesc(value) : value;
			txt += ' (' + valueDesc + ')';
			return txt;
		});

		//component lifetime
		this.observer = null;
		this.mdcSlider = null;
		this._valueSubscription = null;
		this.enableSubscription = null;
	};
	MaterialSlider.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			//mdc-slider uses a rectangle internally to calculate the thumb position,
			//so we must defer initialization till it's visible
			this.observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						this._init(entry.target);
						this.observer.disconnect();
						this.observer = null;
					}
				});
			});
			this.observer.observe(node);
		},
		'dispose': function() {
			if (this.observer)
				this.observer.disconnect();

			if (this.enableSubscription)
				this.enableSubscription.dispose();

			if (this._valueSubscription)
				this._valueSubscription.dispose();

			if (this.mdcSlider)
				this.mdcSlider.destroy();
		},

		'getSliderCss': function() {
			return {
				'mdc-slider--discrete': this.discrete
			};
		},
		'getInputAttrs': function() {
			return {
				'min': this.min,
				'max': this.max,
				'step': this.step,
				'value': this.value,
				'aria-label': this.label
			};
		},
		'onInput': function(vm, event) {
			this.value(event.detail.value);
		},

		'_init': function(node) {
			this.mdcSlider = new materialSlider.MDCSlider($(node).find('.mdc-slider')[0]);
			this.mdcSlider.setDisabled(!ko.unwrap(this.enable));
			this._valueSubscription = this.value.subscribe(newVal => {
				this.mdcSlider.setValue(newVal);
			});
			if (ko.isObservable(this.enable)) {
				this.enableSubscription = this.enable.subscribe(newVal => {
					this.mdcSlider.setDisabled(!newVal);
				});
			}
			//Funny thing is that when the slider is in an opening dialog, its position is not calculated correctly.
			//Let's try to work around it by waiting a bit and recalculating.
			setTimeout(() => this.mdcSlider && this.mdcSlider.foundation.layout(), 100);
			setTimeout(() => this.mdcSlider && this.mdcSlider.foundation.layout(), 250);
		}
	};

	return {
		'viewModel': MaterialSlider,
		'template': htmlString
	};
});
