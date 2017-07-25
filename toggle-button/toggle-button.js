define(['text!./toggle-button.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
		this.enable = params.enable !== undefined ? params.enable : true;
		this.dialogId = tools.getUuid();
	};
	ViewModel.prototype = {
		'onChanged': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.checked);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
