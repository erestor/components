define(['text!./material-progress.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.indeterminate = params.indeterminate;
		this.min = params.min || 0;
		this.max = params.max || 100;
		this.secondaryProgress = params.secondaryProgress || 0;
		this.value = params.value;
		this.enable = tools.readEnableStatus(params);
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
