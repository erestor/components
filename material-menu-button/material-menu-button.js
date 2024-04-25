define(['text!./material-menu-button.html', '../material-menu/material-menu', '../tools/tools'],
function(htmlString, materialMenuComponent, tools) {

	const MaterialMenuButton = function(params) {
		this.icon = params.icon || 'more_vert';
		this.caption = params.caption;
		this.enable = params.enable;
		this.disable = params.disable;
		this.customMenuClass = params.customMenuClass;

		this.menuId = tools.getGuid();
		this.childMenu = new materialMenuComponent.viewModel(params);
		this.bindMenu = ko.observable(false);
	};
	MaterialMenuButton.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			node.classList.add('mdc-menu-surface--anchor');
			node.setAttribute('data-menu', this.menuId);
		},
		'dispose': function() {
			this.childMenu?.dispose();
		},

		'onButtonClick': function() {
			if (!this.bindMenu())
				this.bindMenu(true);
			else
				this.childMenu.mdcMenu.open = true;
		},
		'onMenuRendered': function(node) {
			this.childMenu.koDescendantsComplete(node.parentElement);
			this.childMenu.mdcMenu.open = true;
		}
	};

	return {
		'viewModel': MaterialMenuButton,
		'template': htmlString
	};
});
