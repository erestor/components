define(['text!./text-input.html'],
	function(htmlString) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.hasFocus = params.hasFocus;
		this.enter = params.enter;
		this.placeholder = params.placeholder;
		this.name = params.name;
		this.disable = params.disable;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
