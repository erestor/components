define(['text!./collapse-e.html'], function(htmlString) {
	var ViewModel = function(params) {
		this.data = params.data;
		this.opened = params.opened;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
