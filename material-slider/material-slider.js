define(['text!./material-slider.html', '@knockout-mdc/mdc-tools', '../tools/tools', '@material/slider'],
function(htmlString, mdcTools, tools, materialSlider) {

	const MaterialSlider = function(params) {
		this.min = ko.unwrap(params.min) || 0;
		this.max = ko.unwrap(params.max) || 100;
		this.step = ko.unwrap(params.step) || 1;
		this.discrete = !ko.unwrap(params.continuous);
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
		this._valueSubscription = null;
		this._enableSubscription = null;
		this._intersectionObserver = null;
		this._resizeObserver = null;
	};
	MaterialSlider.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-slider');
			this._intersectionObserver = mdcTools.initOnVisible(el, this);
			this._resizeObserver = mdcTools.layoutOnResize(el);
		},
		'dispose': function() {
			this._resizeObserver?.disconnect();
			this._intersectionObserver?.disconnect();
			this._enableSubscription?.dispose();
			this._valueSubscription?.dispose();
			this.mdcSlider?.destroy();
			this.mdcSlider = null; //because of the timeout hack in _init
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
				'value': ko.unwrap(this.value),
				'aria-label': this.label
			};
		},

		'onInput': function(vm, event) {
			setTimeout(() => {
				this.value(event.detail.value);
			});
		},

		'_init': function(el) {
			this.mdcSlider = new materialSlider.MDCSlider(el);
			mdcTools.setMdcComponent(el, this.mdcSlider);

			this._valueSubscription = this.value.subscribe(newVal => {
				this.mdcSlider.setValue(newVal);
			});

			this.mdcSlider.setDisabled(!ko.unwrap(this.enable));
			if (ko.isObservable(this.enable)) {
				this._enableSubscription = this.enable.subscribe(newVal => {
					this.mdcSlider.setDisabled(!newVal);
				});
			}

			//sometimes, in dynamic layouts, the element is moved after the layout has been calculated, but resize isn't observed
			setTimeout(() => this.mdcSlider?.foundation.layout(), 250);
		}
	};

	return {
		'viewModel': MaterialSlider,
		'template': htmlString
	};
});
