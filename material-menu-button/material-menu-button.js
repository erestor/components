define(['text!./material-menu-button.html', '../material-menu/material-menu'],
function(htmlString, materialMenuComponent) {

	const MaterialMenuButton = function(params) {
		this.customMenu = params.customMenu;
		this.icon = params.icon || 'more_vert';
		this.caption = params.caption;
		this.enable = params.enable;

		if (!this.customMenu)
			this.childMenu = new materialMenuComponent.viewModel(params);
		else
			this.node = null;
	};
	MaterialMenuButton.prototype = {
		'koDescendantsComplete': function(node) {
			$(node).addClass('mdc-menu-surface--anchor');
			if (!this.customMenu)
				this.childMenu.koDescendantsComplete(node);
			else
				this.node = node;
		},
		'dispose': function() {
			if (!this.customMenu)
				this.childMenu.dispose();
			else
				this.node = null;
		},

		'onButtonClick': function() {
			if (!this.customMenu)
				this.childMenu.mdcMenu.open = true;
			else
				$(this.node).find('.mdc-menu').data('mdc-menu').open = true;
		},
		'onSelected': function(vm, event) {
			if (!this.customMenu)
				this.childMenu.onSelected(vm, event);
		}
	};

	return {
		'viewModel': MaterialMenuButton,
		'template': htmlString
	};
});
