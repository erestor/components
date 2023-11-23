define(['text!./material-tooltip.html', '../tools/tools', '@material/tooltip'],
function(htmlString, tools, materialTooltip) {

	var MaterialTooltip = function() {
		this.id = tools.getGuid();

		//component lifetime
		this.mdcTooltip = null;
	};
	MaterialTooltip.prototype = {
		'koDescendantsComplete': function(node) {
			const el = $(node);
			el.prev().attr('aria-describedby', this.id);
			this.mdcTooltip = new materialTooltip.MDCTooltip(el.find('.mdc-tooltip')[0]);
		},
		'dispose': function() {
			this.mdcTooltip.destroy();
		}
	};

	return {
		'viewModel': MaterialTooltip,
		'template': htmlString
	};
});
