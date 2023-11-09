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
		this.bindingSubscription = null;
		this.mdcSwitch = null;
		this.valueSubscription = null;
	};
	MaterialSwitch.prototype = {
		'dispose': function() {
			this.valueSubscription.dispose();
			this.mdcSwitch.destroy();
			this.bindingSubscription.dispose();
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
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialSwitch(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcSwitch = new materialSwitch.MDCSwitch($(node).find('.mdc-switch')[0]);
					vm.mdcSwitch.selected = vm.value();
					vm.valueSubscription = vm.value.subscribe(newVal => {
						vm.mdcSwitch.selected = newVal;
					});
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
