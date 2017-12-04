define(['text!./collapse-r.html'], function(htmlString) {
	var ViewModel = function(params) {
		this.data = params.data;
		this.opened = params.opened;
	};
	ViewModel.prototype = {
		'click': function() {
			this.opened(!this.opened());
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
