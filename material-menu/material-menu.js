define([
	'text!./material-menu.html',
	'@skolaris/knockout-tools',
	'@knockout-mdc/mdc-tools',
	'@knockout-mdc/material-list',
	'@material/menu',
	'@material/ripple'],
function(htmlString, tools, mdcTools, mdcList, materialMenu, materialRipple) {

	const MaterialMenu = function(params) {
		this.id = params.id || tools.getGuid();
		this.css = params.css;

		this.selectedIndex = params.selectedIndex;
		this.select = params.select;
		this.value = params.value;
		this.childList = new mdcList.viewModel(params);

		//component lifetime
		this.mdcMenu = null;
		this.mdcRipples = [];
		this._selectedIndexSubscription = null;
		this._valueSubscription = null;
		this._handleKeyDown = null;
		this._mutationObserver = null;
	};
	MaterialMenu.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-menu');
			const menu = this.mdcMenu = new materialMenu.MDCMenu(el);
			const list = menu.list;
			mdcTools.setMdcComponent(el, menu);

			if (!this.fast)
				this.mdcRipples = list.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));

			menu.setIsHoisted(true);
			if (this.selectedIndex || this.value)
				list.singleSelection = true;

			if (this.selectedIndex) {
				list.selectedIndex = this.selectedIndex();
				this._selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					this._selectIndex(newVal);
				});
			}
			if (this.value) {
				list.selectedIndex = this._findListItemIndex(this.value());
				this._valueSubscription = this.value.subscribe(newVal => {
					this._selectIndex(this._findListItemIndex(newVal));
				});
			}

			list.listElements.forEach(listEl => $(listEl).attr('role', 'menuitem'));

			let typedChars = '';
			this._handleKeyDown = ev => {
				if (!menu.open)
					return;

				const isMenuButton = $(ev.target).closest('.mdc-menu-surface--anchor').attr('data-menu') == menu.root.id;
				const closestMenu = $(ev.target).closest('.mdc-menu');
				const targetMenu = closestMenu.length > 0 && mdcTools.getMdcComponent(closestMenu[0]);
				if (isMenuButton || targetMenu == menu) {
					typedChars += ev.key.toLowerCase();
					const items = menu.items;

					//loop through list items and find the first item that starts with the pressed keys
					for (const item of items) {
						if (!$(item).is(':visible'))
							continue;

						if (item.querySelector('.mdc-deprecated-list-item__text').textContent.trim().toLowerCase().startsWith(typedChars)) {
							menu.foundation.adapter.focusItemAtIndex(items.indexOf(item));
							break;
						}
					}
					setTimeout(() => typedChars = '', 500);
				}
			};
			document.addEventListener('keydown', this._handleKeyDown);

			//menu must be on top level to ensure proper function
			document.body.appendChild(menu.root);

			this._mutationObserver = new MutationObserver(() => list.layout());
			this._mutationObserver.observe(list.root, { childList: true, subtree: true });
		},
		'dispose': function() {
			this._mutationObserver?.disconnect();
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
		},
		'_selectIndex': function(index) {
			const list = this.mdcMenu.list,
				focusedIndex = list.foundation.focusedItemIndex;

			list.selectedIndex = index;
			if (focusedIndex >= 0 && focusedIndex != index)
				list.foundation.focusedItemIndex = -1;
		}
	};

	return {
		'viewModel': MaterialMenu,
		'template': htmlString
	};
});
