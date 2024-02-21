define(['text!./material-menu-button.html', '../material-menu/material-menu', '../tools/tools'],
function(htmlString, materialMenuComponent, tools) {

	const MaterialMenuButton = function(params) {
		this.icon = params.icon || 'more_vert';
		this.caption = params.caption;
		this.enable = params.enable;
		this.disable = params.disable;
		this.customMenuClass = params.customMenuClass;
		this.childMenu = new materialMenuComponent.viewModel(params);
		this.menuId = tools.getGuid();
	};
	MaterialMenuButton.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			$(node).addClass('mdc-menu-surface--anchor').attr('data-menu', this.menuId);
			this.childMenu.koDescendantsComplete(node);
		},
		'dispose': function() {
			if (this.childMenu)
				this.childMenu.dispose();
		},

		'onButtonClick': function() {
			this.childMenu.mdcMenu.open = true;
		},
		'onSelected': function(vm, event) {
			this.childMenu.onSelected(vm, event);
		}
	};

	return {
		'viewModel': MaterialMenuButton,
		'template': htmlString
	};
});
