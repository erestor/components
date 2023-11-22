define(['text!./material-fab.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialFab = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);

		//component lifetime
		this.mdcRipple = null;
	};
	MaterialFab.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcRipple = new materialRipple.MDCRipple($(node).find('.mdc-fab')[0]);
		},
		'dispose': function() {
			this.mdcRipple.destroy();
		}
	};

	return {
		'viewModel': MaterialFab,
		'template': htmlString
	};
});
