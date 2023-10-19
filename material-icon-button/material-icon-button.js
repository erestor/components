define(['text!./material-icon-button.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialIconButton = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);
		this.icon = params.icon;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcRipple = null;
	};
	MaterialIconButton.prototype = {
		'dispose': function() {
			this.mdcRipple.destroy();
			this.bindingSubscription.dispose();
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialIconButton(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcRipple = new materialRipple.MDCRipple($(node).find('.mdc-icon-button')[0]);
					vm.mdcRipple.unbounded = true;
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
