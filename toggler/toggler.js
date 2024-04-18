//Creates an element clicking on which toggles the state of given bool observable
define(['text!./toggler.html'], function(htmlString) {
	var Toggler = function(params) {
		this.value = params.value;
	};
	Toggler.prototype = {
		'click': function() {
			this.value(!this.value());
		}
	};

	return {
		'viewModel': Toggler,
		'template': htmlString
	};
});
