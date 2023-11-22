define(['text!./material-slider.html', '../tools/tools', '@material/slider'],
function(htmlString, tools, materialSlider) {

	var MaterialSlider = function(params) {
		//this.id = tools.getGuid();
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
		this.mdcSlider = null;
		this.valueSubscription = null;
	};
	MaterialSlider.prototype = {
		'koDescendantsComplete': function(node) {
			//mdc-slider uses a rectangle internally to calculate the thumb position,
			//so we must defer if it's not visible at the time of initialization
			const el = $(node),
				visible = el.is(':visible');

			if (!visible) {
				setTimeout(() => this.koDescendantsComplete(node), 10);
				return;
			}
			this.mdcSlider = new materialSlider.MDCSlider(el.find('.mdc-slider')[0]);
			this.valueSubscription = this.value.subscribe(newVal => {
				this.mdcSlider.setValue(newVal);
			});
		},
		'dispose': function() {
			this.valueSubscription.dispose();
			this.mdcSlider.destroy();
		},

		'getSliderCss': function() {
			return {
				'mdc-slider--disabled': !this.enable(),
				'mdc-slider--discrete': this.discrete
			};
		},
		'getInputAttrs': function() {
			return {
				//'id': this.id,
				'min': this.min,
				'max': this.max,
				'step': this.step,
				'value': this.value,
				'aria-label': this.label
			};
		},
		'onInput': function(vm, event) {
			this.value(event.detail.value);
		}
	};

	return {
		'viewModel': MaterialSlider,
		'template': htmlString
	};
});
