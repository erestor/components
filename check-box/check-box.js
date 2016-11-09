define(['text!./check-box.html'],
	function(htmlString) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
		this.enable = params.enable !== undefined ? params.enable : true;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
