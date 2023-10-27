define(['text!./material-tab-bar.html', '../tools/tools', '@material/tab-bar'],
function(htmlString, tools, materialTabBar) {

	var MaterialTabBar = function(params) {
		this.tabs = params.tabs;
		this.selected = params.selected;
		this.id = tools.getGuid();

		//component lifetime
		this.bindingSubscription = null;
		this.mdcTabBar = null;
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTabBar(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcTabBar = new materialTabBar.MDCTabBar($(node).find('.mdc-tab-bar')[0]);
					$(node).on('MDCTabBar:activated', event => {
						if (event.target.id === vm.id)
							vm.selected(event.detail.index);
					});
					vm.dispose = () => {
						//need the node for event off, hence this is not in the prototype
						$(node).off('MDCTabBar:activated');
						vm.mdcTabBar.destroy();
						vm.bindingSubscription.dispose();
					};
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
