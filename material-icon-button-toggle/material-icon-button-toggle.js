define(['text!./material-icon-button-toggle.html', '../tools/tools', '@material/icon-button'],
function(htmlString, tools, materialIconButton) {

	var MaterialIconButtonToggle = function(params) {
		this.value = params.value;
		this.icons = params.icons;
		this.titles = params.titles;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		//component lifetime
		this.bindingSubscription = null;
		this.mdcIconButton = null;
		this.valueSubscription = null;
	};
	MaterialIconButtonToggle.prototype = {
		'dispose': function() {
			this.valueSubscription.dispose();
			this.mdcIconButton.destroy();
			this.bindingSubscription.dispose();
		},
		'onChange': function(vm, event) {
			this.value(event.detail.isOn);
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialIconButtonToggle(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcIconButton = new materialIconButton.MDCIconButtonToggle($(node).find('.mdc-icon-button')[0]);
					vm.mdcIconButton.on = vm.value();
					vm.valueSubscription = vm.value.subscribe(newVal => {
						vm.mdcIconButton.on = newVal;
					});
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
