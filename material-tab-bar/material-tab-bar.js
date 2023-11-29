define(['text!./material-tab-bar.html', '../tools/tools', '@material/tab-bar'],
function(htmlString, tools, materialTabBar) {

	const MaterialTabBar = function(params) {
		this.tabs = params.tabs;
		this.selected = params.selected;
		this.id = tools.getGuid();

		//component lifetime
		this.mdcTabBar = null;
		this.selectionSubscription = null;
	};
	MaterialTabBar.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcTabBar = new materialTabBar.MDCTabBar($(node).find('.mdc-tab-bar')[0]);
			this.mdcTabBar.activateTab(this.selected());
			this.selectionSubscription = this.selected.subscribe(newVal => {
				this.mdcTabBar.activateTab(newVal);
			});
		},
		'dispose': function() {
			this.selectionSubscription.dispose();
			this.mdcTabBar.destroy();
		},

		'onActivated': function(vm, event) {
			this.selected(event.detail.index);
		}
	};

	return {
		'viewModel': MaterialTabBar,
		'template': htmlString
	};
});
