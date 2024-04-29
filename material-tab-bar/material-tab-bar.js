define(['text!./material-tab-bar.html', '@skolaris/knockout-tools', '@material/tab-bar'],
function(htmlString, tools, materialTabBar) {

	const MaterialTabBar = function(params) {
		this.tabs = params.tabs;
		this.selected = params.selected;
		this.id = tools.getGuid();

		//component lifetime
		this.mdcTabBar = null;
		this._selectionSubscription = null;
	};
	MaterialTabBar.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcTabBar = new materialTabBar.MDCTabBar(node.querySelector('.mdc-tab-bar'));
			this.mdcTabBar.activateTab(this.selected());
			this._selectionSubscription = this.selected.subscribe(newVal => {
				this.mdcTabBar.activateTab(newVal);
			});
		},
		'dispose': function() {
			this._selectionSubscription?.dispose();
			this.mdcTabBar?.destroy();
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
