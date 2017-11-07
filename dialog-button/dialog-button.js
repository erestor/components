define(['text!./dialog-button.html', '../dialog-button-base/dialog-button-base'],
	function(htmlString, DialogButtonBase) {

	var ViewModel = function(params) {
		DialogButtonBase.call(this, params);
		this.icon = params.icon;
		this.tooltip = params.tooltip;
		this.raw = params.raw;
		this.closeBtnLabel = params.closeBtnLabel;
	};
	ViewModel.prototype = Object.create(DialogButtonBase.prototype);
	ViewModel.prototype.constructor = ViewModel;

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
