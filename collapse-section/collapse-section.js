define([
	'text!./collapse-section.html'],
	function(htmlString) {

	var ViewModel = function(params) {
		this.title = params.title;
		this.titleIcon = params.titleIcon;
		this.opened = params.opened || ko.observable();
		this.icon = params.icon;
		this.data = params.data;
		this.justified = !params.tight;

		var self = this;
		this.buttonIcon = ko.pureComputed(function() {
			if (!self.icon)
				return self.opened() ? 'expand-less' : 'expand-more';

			return self.icon;
		});

		this.titleClass = {};
		this.titleClass[params.titleClass || 'subhead'] = true;

		this.heightTweak = ko.observable(self.opened());
	};
	ViewModel.prototype = {
		'click': function() {
			this.heightTweak(false);
			this.opened(!this.opened());
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
