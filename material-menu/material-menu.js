define(['text!./material-menu.html', '../material-list/material-list', '@material/menu'],
function(htmlString, materialListComponent, materialMenu) {

	const MaterialMenu = function(params) {
		this.childList = new materialListComponent.viewModel(params);

		//component lifetime
		this.mdcMenu = null;
	};
	MaterialMenu.prototype = {
		'koDescendantsComplete': function(node) {
			this.childList.koDescendantsComplete(node);
			this.childList.mdcList.listElements.forEach(el => $(el).attr('role', 'menuitem'));
			this.mdcMenu = new materialMenu.MDCMenu($(node).find('.mdc-menu')[0]);
			this.mdcMenu.open = true;
		},
		'dispose': function() {
			this.childList.dispose();
			this.mdcMenu.destroy();
		}
	};

	return {
		'viewModel': MaterialMenu,
		'template': htmlString
	};
});
