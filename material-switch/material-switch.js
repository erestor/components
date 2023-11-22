define(['text!./material-switch.html', '../tools/tools', '@material/switch'],
function(htmlString, tools, materialSwitch) {

	var MaterialSwitch = function(params) {
		this.label = params.label;
		this.title = params.title;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		this.structuredLabel = this.label instanceof Array;
		this.singleLabel = this.label !== undefined && !this.structuredLabel;

		if (!params.invert)
			this.value = params.value;
		else {
			this.value = ko.computed({
				'read': function() {
					return !params.value();
				},
				'write': function(newValue) {
					params.value(!newValue);
				}
			});
			this.inverted = true;
		}

		//component lifetime
		this.mdcSwitch = null;
		this.valueSubscription = null;
	};
	MaterialSwitch.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcSwitch = new materialSwitch.MDCSwitch($(node).find('.mdc-switch')[0]);
			this.mdcSwitch.selected = this.value();
			this.valueSubscription = this.value.subscribe(newVal => {
				this.mdcSwitch.selected = newVal;
			});
		},
		'dispose': function() {
			this.valueSubscription.dispose();
			this.mdcSwitch.destroy();
			if (this.inverted)
				this.value.dispose();
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
		}
	};

	return {
		'viewModel': MaterialSwitch,
		'template': htmlString
	};
});
