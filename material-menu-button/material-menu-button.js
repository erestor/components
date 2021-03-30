define(['text!./material-menu-button.html', '../material-select/material-select'],
function(htmlString, materialSelectComponent) {

	var MaterialSelectVM = materialSelectComponent.viewModel;

	function ViewModel(params) {
		MaterialSelectVM.call(this, params);
		this.buttonCaption = params.buttonCaption;
		this.noselect = params.noselect;
		this.icon = params.icon || 'icons:arrow-drop-down';
	}
	ViewModel.prototype = Object.create(MaterialSelectVM.prototype);
	ViewModel.prototype.constructor = ViewModel;

	ViewModel.prototype.getDropdown = function() {
		if (!this.dropdownEl)
			this.dropdownEl = $('#' + this.rootId)[0].$.dropdown;

		return this.dropdownEl;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
