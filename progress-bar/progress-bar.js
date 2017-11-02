define(['text!./progress-bar.html'],
function(htmlString) {

	var ViewModel = function(params) {
		this.indeterminate = params.indeterminate;
		this.min = params.min || 0;
		this.max = params.max || 100;
		this.secondaryProgress = params.secondaryProgress || 0;
		this.value = params.value;
		this.enable = params.enable !== undefined ? params.enable : true;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
