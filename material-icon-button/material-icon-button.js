define(['text!./material-icon-button.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialIconButton = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);
		this.icon = params.icon;

		//component lifetime
		this.mdcRipple = null;
	};
	MaterialIconButton.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcRipple = new materialRipple.MDCRipple($(node).find('.mdc-icon-button')[0]);
			this.mdcRipple.unbounded = true;
		},
		'dispose': function() {
			this.mdcRipple.destroy();
		}
	};

	return {
		'viewModel': MaterialIconButton,
		'template': htmlString
	};
});
