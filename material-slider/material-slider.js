define(['text!./material-slider.html', '../tools/tools', '@material/slider'],
function(htmlString, tools, materialSlider) {

	var MaterialSlider = function(params) {
		this.id = tools.getGuid();
		this.min = params.min || 0;
		this.max = params.max || 100;
		this.step = params.step || 1;
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
		this.bindingSubscription = null;
		this.mdcSlider = null;
	};
	MaterialSlider.prototype = {
		'dispose': function() {
			this.mdcSlider.destroy();
			this.bindingSubscription.dispose();
		},
		'getSliderCss': function() {
			return {
				'mdc-slider--disabled': !this.enable(),
				'mdc-slider--discrete': this.step > 1
			};
		},
		'getInputAttrs': function() {
			return {
				'id': this.id,
				'min': this.min,
				'max': this.max,
				'step': this.step,
				'value': this.value,
				'name': this.label,
				'aria-label': this.label
			};
		},
		'onInput': function(vm, event) {
			this.value(event.detail.value);
		}
	};

	return {
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialSlider(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcSlider = new materialSlider.MDCSlider($(node).find('.mdc-slider')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
