﻿define(['text!./help-button.html', '../dialog-button-base/dialog-button-base'],
	function(htmlString, DialogButtonBase) {

	var ViewModel = function(params) {
		DialogButtonBase.call(this, params);
		this.icon = params.outline ? 'icons:help-outline' : 'icons:help';
	};
	ViewModel.prototype = Object.create(DialogButtonBase.prototype);
	ViewModel.prototype.constructor = ViewModel;

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
