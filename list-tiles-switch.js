define([
	'text!./list-tiles-switch.html',
	'lang'],
	function(htmlString, lang) {

	var ViewModel = function(params) {
		this.displayTiles = params.value;
		this.locale = lang.locale;
	};

	ViewModel.prototype = {
		'displayTilesOn': function() {
			this.displayTiles(true);
		},
		'displayTilesOff': function() {
			this.displayTiles(false);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
