define(['text!./material-icon-button.html', '@skolaris/knockout-tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	const MaterialIconButton = function(params) {
		this.click = params.click;
		this.enable = tools.isComponentEnabled(params);
		this.icon = params.icon;

		//component lifetime
		this.mdcRipple = null;
	};
	MaterialIconButton.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcRipple = new materialRipple.MDCRipple(node.querySelector('.mdc-icon-button'));
			this.mdcRipple.unbounded = true;
		},
		'dispose': function() {
			this.mdcRipple?.destroy();
		}
	};

	return {
		'viewModel': MaterialIconButton,
		'template': htmlString
	};
});
