define(['text!./material-fab.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialFab = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialFab(params);
				const sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					new materialRipple.MDCRipple($(node).find('.mdc-fab')[0]);
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
