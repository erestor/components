define(['text!./material-switch.html', '@knockout-mdc/mdc-tools', '../tools/tools', '@material/switch'],
function(htmlString, mdcTools, tools, materialSwitch) {

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
				'write': newValue => params.value(!newValue)
			});
			this._inverted = true;
		}

		//component lifetime
		this.mdcSwitch = null;
		this._valueSubscription = null;
		this._intersectionObserver = null;
	};
	MaterialSwitch.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-switch');
			this._intersectionObserver = mdcTools.initOnVisible(el, this);
		},
		'dispose': function() {
			this._intersectionObserver?.disconnect();
			this._valueSubscription?.dispose();
			if (this._inverted)
				this.value.dispose();

			this.mdcSwitch?.destroy();
		},

		'getLabelCss': function() {
			return {
				'material-switch-label__structured': this.structuredLabel
			};
		},

		'toggle': function() {
			//the switch doesn't emit an event, so we need to manually update the value
			//but we must do it after the internal value of the switch has been updated
			setTimeout(() => {
				this.value(!this.value());
			});
		},

		'_init': function(el) {
			this.mdcSwitch = new materialSwitch.MDCSwitch(el);
			mdcTools.setMdcComponent(el, this.mdcSwitch);

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
