define(['text!./material-menu-button.html', '../material-menu/material-menu'],
function(htmlString, materialMenuComponent) {

	const MaterialMenuButton = function(params) {
		this.icon = params.icon || 'more_vert';
		this.caption = params.caption;
		this.enable = params.enable;
		this.disable = params.disable;
		this.childMenu = new materialMenuComponent.viewModel(params);
	};
	MaterialMenuButton.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			$(node).addClass('mdc-menu-surface--anchor');
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
