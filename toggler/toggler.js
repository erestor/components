//Creates an element clicking on which toggles the state of given bool observable
define(['text!./toggler.html'], function(htmlString) {
	var ViewModel = function(params) {
		this.data = params.data;
		this.value = params.value;
	};
	ViewModel.prototype = {
		'click': function() {
			this.value(!this.value());
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
