define(['text!./material-tab-bar.html', '../tools/tools', '@material/tab-bar'],
function(htmlString, tools, materialTabBar) {

	var MaterialTabBar = function(params) {
		this.tabs = params.tabs;
		this.selected = params.selected;
		this.id = tools.getGuid();

		//component lifetime
		this.bindingSubscription = null;
		this.mdcTabBar = null;
		this.selectionSubscription = null;
	};
	MaterialTabBar.prototype = {
		'dispose': function() {
			this.selectionSubscription.dispose();
			this.mdcTabBar.destroy();
			this.bindingSubscription.dispose();
		},
		'onActivated': function(vm, event) {
			this.selected(event.detail.index);
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTabBar(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcTabBar = new materialTabBar.MDCTabBar($(node).find('.mdc-tab-bar')[0]);
					vm.mdcTabBar.activateTab(vm.selected());
					vm.selectionSubscription = vm.selected.subscribe(newVal => {
						vm.mdcTabBar.activateTab(newVal);
					});
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
