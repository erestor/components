define(['text!./check-box.html', '../tools/tools'],
	function(htmlString, tools) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
		this.enable = tools.readEnableStatus(params);
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
