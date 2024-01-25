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

			this._handleKeyDown = ev => {
				if (ev.target == el || $(ev.target).parents().find(el).length ||
					$(ev.target.parentElement?.parentElement).find('.mdc-menu').data('mdc-menu') == this.mdcMenu) {
					const key = ev.key.toLowerCase();
					const items = this.mdcMenu.list.listElements;

					//loop through list items and find the first item that starts with the pressed key
					for (const item of items) {
						if (item.textContent.trim().toLowerCase().startsWith(key)) {
							this.mdcMenu.foundation.adapter.focusItemAtIndex(items.indexOf(item));
							break;
						}
					}
				}
			};
			document.addEventListener('keydown', this._handleKeyDown);
		},
		'dispose': function() {
			if (this._handleKeyDown)
				document.removeEventListener('keydown', this._handleKeyDown);

			if (this._selectedIndexSubscription)
				this._selectedIndexSubscription.dispose();

			if (this._valueSubscription)
				this._valueSubscription.dispose();

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
