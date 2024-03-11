define([
	'text!./material-menu.html',
	'../material-list/material-list',
	'../tools/tools.mdc',
	'@material/menu',
	'@material/ripple'],
function(htmlString, materialListComponent, mdcTools, materialMenu, materialRipple) {

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

			const el = node.querySelector('.mdc-menu');
			this.mdcMenu = new materialMenu.MDCMenu(el);
			mdcTools.setMdcComponent(el, this.mdcMenu);

			if (!this.fast)
				this.mdcRipples = this.mdcMenu.list.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));

			this.mdcMenu.setIsHoisted(true);
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

			let typedChars = '';
			this._handleKeyDown = ev => {
				if (!this.mdcMenu.open)
					return;

				const isMenuButton = $(ev.target).closest('.mdc-menu-surface--anchor').attr('data-menu') == this.mdcMenu.root.id;
				const closestMenu = $(ev.target).closest('.mdc-menu');
				const targetMenu = closestMenu.length > 0 && mdcTools.getMdcComponent(closestMenu[0]);
				if (isMenuButton || targetMenu == this.mdcMenu) {
					typedChars += ev.key.toLowerCase();
					const items = this.mdcMenu.items;

					//loop through list items and find the first item that starts with the pressed keys
					for (const item of items) {
						if (!$(item).is(':visible'))
							continue;

						if (item.querySelector('.mdc-deprecated-list-item__text').textContent.trim().toLowerCase().startsWith(typedChars)) {
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

			this._selectedIndexSubscription?.dispose();
			this._valueSubscription?.dispose();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			if (this.mdcMenu) {
				const el = this.mdcMenu.root;
				this.mdcMenu.destroy();
				ko.removeNode(el);
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
