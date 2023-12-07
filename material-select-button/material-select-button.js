define([
	'text!./material-select-button.html',
	'../material-select/material-select'
],
function(htmlString, materialSelectComponent) {

	const MaterialSelectVM = materialSelectComponent.viewModel;

	function MaterialSelectButton(params) {

		//fix polymer bug where dropdown appears as much below the button as the page is scrolled, making it possibly appear below viewscreen
		//(even though paper-menu-button vertical-align should be 'top' by default!)
		if (params.valign === undefined)
			params.valign = 'top';

		MaterialSelectVM.call(this, params);
		this.buttonCaption = params.buttonCaption;
		this.icon = params.icon || 'arrow_drop_down';

		var self = this;
		this.dropdownTriggerCaption = ko.computed(function() {
			return self.buttonCaption == 'selection' ? self.selectedItemText() : ko.unwrap(self.buttonCaption);
		});
	}
	MaterialSelectButton.prototype = Object.create(MaterialSelectVM.prototype);
	MaterialSelectButton.prototype.constructor = MaterialSelectButton;

	MaterialSelectButton.prototype.getDropdown = function() {
		if (!this.dropdownEl)
			this.dropdownEl = $('#' + this.rootId)[0].$.dropdown;

		return this.dropdownEl;
	};

	return {
		'viewModel': MaterialSelectButton,
		'template': htmlString
	};
});
