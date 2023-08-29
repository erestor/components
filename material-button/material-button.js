define(['text!./material-button.html', '../tools/tools'],
function(htmlString, tools) {

	var MaterialButton = function(params) {
		//attributes
		this.autofocus = params.autofocus;
		this.dialogConfirm = params.dialogConfirm;
		this.dialogDismiss = params.dialogDismiss;
		this.slot = params.slot;
		//this.id = tools.getGuid();

		//data binding
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);
	};
	MaterialButton.prototype = {
	};

    return {
		'viewModel': MaterialButton,
		'template': htmlString
	};
});
