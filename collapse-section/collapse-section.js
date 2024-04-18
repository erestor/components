define(['text!./collapse-section.html'], function(htmlString) {

	var CollapseSection = function(params) {
		this.title = params.title;
		this.titleIcon = params.titleIcon;
		this.opened = params.opened || ko.observable();
		this.icon = params.icon;
		this.tooltip = params.tooltip;
		this.centerTitle = ko.unwrap(params.centerTitle);
		this.justified = !ko.unwrap(params.tight) && !ko.unwrap(params.centerTitle);

		this.buttonIcon = ko.pureComputed(() => !this.icon ? 'expand_more' : this.icon);
		this.titleClass = {};
		if (params.titleClass)
			this.titleClass[params.titleClass] = true;
	};
	CollapseSection.prototype = {
		'click': function() {
			this.opened(!this.opened());
		},
		'getHeaderCss': function() {
			return {
				'collapse-section__header--center': this.centerTitle,
				'collapse-section__header--justified': this.justified
			};
		}
	};

	return {
		'viewModel': CollapseSection,
		'template': htmlString
	};
});
