define([
	'text!./collapse-section.html', 'lang'],
	function(htmlString, lang) {

	var locale = lang.locale,

	ViewModel = function(params) {
		this.title = params.title;
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
		this.buttonTitle = ko.pureComputed(function() {
			return locale().toggle;
			//return self.opened() ? locale().shrink : locale().expand;
		});
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
