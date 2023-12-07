define(['text!./material-menu.html', '../material-list/material-list', '@material/menu', '@material/ripple'],
function(htmlString, materialListComponent, materialMenu, materialRipple) {

	const MaterialMenu = function(params) {
		this.selected = params.selected;
		this.align = params.align;
		this.childList = new materialListComponent.viewModel(params);

		//component lifetime
		this.mdcMenu = null;
		this.mdcRipples = [];
		this.selectedSubscription = null;
	};
	MaterialMenu.prototype = {
		'koDescendantsComplete': function(node) {
			const el = $(node).find('.mdc-menu');
			this.mdcMenu = new materialMenu.MDCMenu(el[0]);
			if (!this.fast)
				this.mdcRipples = this.mdcMenu.list.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));

			if (this.align == 'right') {
				this.mdcMenu.setAnchorCorner(materialMenu.Corner.TOP_END);
				//this.mdcMenu.setAnchorMargin({'right': '4px'}); doesn't work
			}
			if (this.selected) {
				this.mdcMenu.list.singleSelection = true;
				this.mdcMenu.setSelectedIndex(ko.unwrap(this.selected));
				this.selectedSubscription = this.selected.subscribe(newVal => {
					this.mdcMenu.setSelectedIndex(newVal);
				});
			}

			this.mdcMenu.list.listElements.forEach(listEl => $(listEl).attr('role', 'menuitem'));
			el.data('mdc-menu', this.mdcMenu); //this is necessary to allow opening the menu from outside the component
		},
		'dispose': function() {
			if (this.selectedSubscription)
				this.selectedSubscription.dispose();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			this.mdcMenu.destroy();
		},

		'onSelected': function(vm, event) {
			if (this.selected)
				this.selected(event.detail.index);
		}
	};

	return {
		'viewModel': MaterialMenu,
		'template': htmlString
	};
});
