define(['text!./material-tooltip.html', '@skolaris/knockout-tools', '@material/tooltip'],
function(htmlString, tools, materialTooltip) {

	const MaterialTooltip = function() {
		this.id = tools.getGuid();

		//component lifetime
		this.mdcTooltip = null;
	};
	MaterialTooltip.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			$(node).prev().attr('aria-describedby', this.id);
			this.mdcTooltip = new materialTooltip.MDCTooltip(node.querySelector('.mdc-tooltip'));
		},
		'dispose': function() {
			this.mdcTooltip?.destroy();
		}
	};

	return {
		'viewModel': MaterialTooltip,
		'template': htmlString
	};
});
