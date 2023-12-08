define(['text!./material-tooltip.html', '../tools/tools', '@material/tooltip'],
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

			const el = $(node);
			el.prev().attr('aria-describedby', this.id);
			this.mdcTooltip = new materialTooltip.MDCTooltip(el.find('.mdc-tooltip')[0]);
		},
		'dispose': function() {
			if (this.mdcTooltip)
				this.mdcTooltip.destroy();
		}
	};

	return {
		'viewModel': MaterialTooltip,
		'template': htmlString
	};
});
