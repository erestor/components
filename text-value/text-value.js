define(['text!./text-value.html'],
	function(htmlString) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
		this.help = params.help;
		this.helpTitle = params.helpTitle || params.label;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
