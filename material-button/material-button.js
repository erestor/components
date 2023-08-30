define(['text!./material-button.html', '../tools/tools'],
function(htmlString, tools) {

	var MaterialButton = function(params) {
		//attributes
		this.autofocus = params.autofocus;
		this.elevation = params.elevation;
		this.noink = params.noink;
		this.raised = params.raised;
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
