define(['text!./material-icon-button.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialIconButton = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);
		this.icon = params.icon;
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialIconButton(params);
				var sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', function(node) {
					var ripple = new materialRipple.MDCRipple($(node).find('.mdc-icon-button')[0]);
					ripple.unbounded = true;
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
