define([
	'text!./language-selector.html',
	'lang'],
	function(htmlString, lang) {

	var ViewModel = function(params) {
		this.halign = params.halign || 'right';
		this.setCzech = lang.setCzech;
		this.setEnglish = lang.setEnglish;
		this.localeId = lang.localeId;
		this.locale = lang.locale;

		var self = this;
		this.selectedLangIndex = ko.pureComputed(function() {
			switch (self.localeId()) {
				case 'cz': return 0;
				case 'en': return 1;
			}
		});
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
