define(['text!./material-menu.html', '../material-list/material-list', '../tools/tools', '@material/menu', '@material/ripple'],
function(htmlString, materialListComponent, tools, materialMenu, materialRipple) {

	const MaterialMenu = function(params) {
		this.selectedIndex = params.selectedIndex;
		this.select = params.select;
		this.value = params.value;
		this.childList = new materialListComponent.viewModel(params);

		//component lifetime
		this.mdcMenu = null;
		this.mdcRipples = [];
		this._selectedIndexSubscription = null;
		this._valueSubscription = null;
		this._handleKeyDown = null;
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
				this._selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					this.mdcMenu.list.selectedIndex = newVal;
				});
			}
			if (this.value) {
				this.mdcMenu.list.selectedIndex = this._findListItemIndex(this.value());
				this._valueSubscription = this.value.subscribe(newVal => {
					this.mdcMenu.list.selectedIndex = this._findListItemIndex(newVal);
				});
			}

			this.mdcMenu.list.listElements.forEach(listEl => $(listEl).attr('role', 'menuitem'));
			el.data('mdc-menu', this.mdcMenu); //this is necessary to allow opening the menu from outside the component

			let typedChars = '';
			this._handleKeyDown = ev => {
				if (!this.mdcMenu.open)
					return;

				const isMenuButton = $(ev.target).closest('.mdc-menu-surface--anchor').attr('data-menu') == el.attr('id');
				const targetMenu = $(ev.target).closest('.mdc-menu').data('mdc-menu');
				if (isMenuButton || targetMenu == this.mdcMenu) {
					typedChars += ev.key.toLowerCase();
					const items = this.mdcMenu.items;

					//loop through list items and find the first item that starts with the pressed keys
					for (const item of items) {
						if (!$(item).is(':visible'))
							continue;

						if ($(item).find('.mdc-deprecated-list-item__text')[0].textContent.trim().toLowerCase().startsWith(typedChars)) {
							this.mdcMenu.foundation.adapter.focusItemAtIndex(items.indexOf(item));
							break;
						}
					}
					setTimeout(() => typedChars = '', 500);
				}
			};
			document.addEventListener('keydown', this._handleKeyDown);

			//menu must be on top level to ensure proper function
			document.body.appendChild(this.mdcMenu.root);
		},
		'dispose': function() {
			if (this._handleKeyDown)
				document.removeEventListener('keydown', this._handleKeyDown);

			if (this._selectedIndexSubscription)
				this._selectedIndexSubscription.dispose();

			if (this._valueSubscription)
				this._valueSubscription.dispose();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			if (this.mdcMenu) {
				const el = this.mdcMenu.root;
				this.mdcMenu.destroy();
				tools.cleanNode(el);
				document.body.removeChild(el);
			}
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
		},

		'_findListItemIndex': function(value) {
			const listItems = this.mdcMenu.list.listElements;
			return listItems.findIndex(listItem => $(listItem).attr('data-value') == value);
		}
	};

	return {
		'viewModel': MaterialMenu,
		'template': htmlString
	};
});
