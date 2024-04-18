define(['text!./material-fab.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	const MaterialFab = function(params) {
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);

		//component lifetime
		this.mdcRipple = null;
	};
	MaterialFab.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcRipple = new materialRipple.MDCRipple(node.querySelector('.mdc-fab'));
		},
		'dispose': function() {
			this.mdcRipple?.destroy();
		}
	};

	return {
		'viewModel': MaterialFab,
		'template': htmlString
	};
});
