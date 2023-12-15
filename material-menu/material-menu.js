define(['text!./material-menu.html', '../material-list/material-list', '@material/menu', '@material/ripple'],
function(htmlString, materialListComponent, materialMenu, materialRipple) {

	const MaterialMenu = function(params) {
		this.selectedIndex = params.selectedIndex;
		this.select = params.select;
		this.value = params.value;
		this.childList = new materialListComponent.viewModel(params);

		//component lifetime
		this.mdcMenu = null;
		this.mdcRipples = [];
		this.selectedIndexSubscription = null;
		this.valueSubscription = null;
	};
	MaterialMenu.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = $(node).find('.mdc-menu');
			this.mdcMenu = new materialMenu.MDCMenu(el[0]);
			if (!this.fast)
				this.mdcRipples = this.mdcMenu.list.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));

			this.mdcMenu.setFixedPosition(true);
			if (this.selectedIndex || this.value)
				this.mdcMenu.list.singleSelection = true;

			if (this.selectedIndex) {
				this.mdcMenu.list.selectedIndex = this.selectedIndex();
				this.selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					this.mdcMenu.list.selectedIndex = newVal;
				});
			}
			if (this.value) {
				this.mdcMenu.list.selectedIndex = this.mdcMenu.list.listElements.findIndex(listEl => $(listEl).attr('data-value') == this.value());
				this.valueSubscription = this.value.subscribe(newVal => {
					this.mdcMenu.list.selectedIndex = this.mdcMenu.list.listElements.findIndex(listEl => $(listEl).attr('data-value') == newVal);
				});
			}

			this.mdcMenu.list.listElements.forEach(listEl => $(listEl).attr('role', 'menuitem'));
			el.data('mdc-menu', this.mdcMenu); //this is necessary to allow opening the menu from outside the component
		},
		'dispose': function() {
			if (this.selectedIndexSubscription)
				this.selectedIndexSubscription.dispose();

			if (this.valueSubscription)
				this.valueSubscription.dispose();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			if (this.mdcMenu)
				this.mdcMenu.destroy();
		},

		'onSelected': function(vm, event) {
			//the action could lead to menu items changing, so wait till mdc processing is done
			const value = $(event.detail.item).attr('data-value');
			setTimeout(() => {
				if (this.selectedIndex)
					this.selectedIndex(event.detail.index);

				if (this.value)
					this.value(value);

				if (this.select)
					this.select(value, event.detail.index);
			});
		}
	};

	return {
		'viewModel': MaterialMenu,
		'template': htmlString
	};
});
