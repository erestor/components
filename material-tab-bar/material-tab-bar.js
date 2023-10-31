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
	MaterialTabBar.prototype = {
		'dispose': function() {
			this.mdcTabBar.destroy();
			this.bindingSubscription.dispose();
		},
		'onActivated': function(vm, event) {
			if (event.target.id === this.id)
				this.selected(event.detail.index);
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTabBar(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcTabBar = new materialTabBar.MDCTabBar($(node).find('.mdc-tab-bar')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
