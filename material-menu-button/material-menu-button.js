define([
	'text!./material-menu-button.html',
	'../material-select/material-select'
],
function(htmlString, materialSelectComponent) {

	var MaterialSelectVM = materialSelectComponent.viewModel;

	function MaterialMenuButton(params) {

		//fix polymer bug where dropdown appears as much below the button as the page is scrolled, making it possibly appear below viewscreen
		//(even though paper-menu-button vertical-align should be 'top' by default!)
		if (params.valign === undefined)
			params.valign = 'top';

		MaterialSelectVM.call(this, params);
		this.buttonCaption = params.buttonCaption;
		this.noselect = params.noselect;
		this.icon = params.icon || 'arrow_drop_down';

		var self = this;
		this.dropdownTriggerCaption = ko.computed(function() {
			return self.buttonCaption == 'selection' ? self.selectedItemText() : ko.unwrap(self.buttonCaption);
		});
	}
	MaterialMenuButton.prototype = Object.create(MaterialSelectVM.prototype);
	MaterialMenuButton.prototype.constructor = MaterialMenuButton;

	MaterialMenuButton.prototype.getDropdown = function() {
		if (!this.dropdownEl)
			this.dropdownEl = $('#' + this.rootId)[0].$.dropdown;

		return this.dropdownEl;
	};

	return {
		'viewModel': MaterialMenuButton,
		'template': htmlString
	};
});
