define(['text!./text-value.html'],
	function(htmlString) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
