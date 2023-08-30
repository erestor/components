define(['text!./dialog-button.html', '../dialog-button-base/dialog-button-base'],
	function(htmlString, DialogButtonBase) {

	var DialogButton = function(params) {
		DialogButtonBase.call(this, params);
		this.icon = params.icon;
		this.tooltip = params.tooltip;
		this.raw = params.raw;
		this.closeBtnLabel = params.closeBtnLabel;
	};
	DialogButton.prototype = Object.create(DialogButtonBase.prototype);
	DialogButton.prototype.constructor = DialogButton;

	return {
		'viewModel': DialogButton,
		'template': htmlString
	};
});
