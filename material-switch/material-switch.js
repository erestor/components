define(['text!./material-switch.html', '../tools/tools', '@material/switch'],
function(htmlString, tools, materialSwitch) {

	const MaterialSwitch = function(params) {
		this.label = params.label;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		this.structuredLabel = this.label instanceof Array;
		this.singleLabel = this.label !== undefined && !this.structuredLabel;
		this.showLabel = this.structuredLabel || this.singleLabel;

		if (!params.invert)
			this.value = params.value;
		else {
			this.value = ko.computed({
				'read': () => !params.value(),
				'write': function(newValue) {
					params.value(!newValue);
				}
			});
			this.inverted = true;
		}

		//component lifetime
		this.observer = null;
		this.mdcSwitch = null;
		this._valueSubscription = null;
	};
	MaterialSwitch.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

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

			if (this.mdcSwitch) {
				this._valueSubscription.dispose();
				this.mdcSwitch.destroy();
				if (this.inverted)
					this.value.dispose();
			}
		},

		'toggle': function() {
			//the switch doesn't emit an event, so we need to manually update the value
			//but we must do it after the internal value of the switch has been updated
			setTimeout(() => {
				this.value(!this.value());
			});
		},
		'getLabelCss': function() {
			return {
				'material-switch-label__structured': this.structuredLabel
			};
		},

		'_init': function(node) {
			this.mdcSwitch = new materialSwitch.MDCSwitch($(node).find('.mdc-switch')[0]);
			this.mdcSwitch.selected = this.value();
			this._valueSubscription = this.value.subscribe(newVal => {
				this.mdcSwitch.selected = newVal;
			});
		}
	};

	return {
		'viewModel': MaterialSwitch,
		'template': htmlString
	};
});
