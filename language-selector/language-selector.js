define([
	'text!./language-selector.html',
	'lang'],
	function(htmlString, lang) {

	var ViewModel = function(params) {
		this.halign = params.halign || "left";
		this.setCzech = lang.setCzech;
		this.setEnglish = lang.setEnglish;
		this.localeId = lang.localeId;
		this.locale = lang.locale;
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
