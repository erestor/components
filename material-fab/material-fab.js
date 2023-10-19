define(['text!./material-fab.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialFab = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);

		//component lifetime
		this.bindingSubscription = null;
		this.mdcRipple = null;
	};
	MaterialFab.prototype = {
		'dispose': function() {
			this.mdcRipple.destroy();
			this.bindingSubscription.dispose();
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialFab(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcRipple = new materialRipple.MDCRipple($(node).find('.mdc-fab')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
