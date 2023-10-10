define([
	'text!./collapse-section.html'],
	function(htmlString) {

	var CollapseSection = function(params) {
		this.title = params.title;
		this.titleIcon = params.titleIcon;
		this.opened = params.opened || ko.observable();
		this.icon = params.icon;
		this.data = params.data;
		this.centerTitle = params.centerTitle;
		this.justified = !params.tight && !params.centerTitle;

		var self = this;
		this.buttonIcon = ko.pureComputed(function() {
			if (!self.icon)
				return 'expand_more';

			return self.icon;
		});

		this.titleClass = {};
		this.titleClass[params.titleClass || 'subhead'] = true;
	};
	CollapseSection.prototype = {
		'click': function() {
			this.opened(!this.opened());
		}
	};

	return {
		'viewModel': CollapseSection,
		'template': htmlString
	};
});
