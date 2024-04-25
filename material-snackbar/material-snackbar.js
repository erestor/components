define(['text!./material-snackbar.html', '@knockout-mdc/mdc-tools', '@material/snackbar'],
function(htmlString, mdcTools, materialSnackbar) {

	const MaterialSnackbar = function(params) {
		this.id = params.id;
		this.label = params.label;
		this.button = params.button;
		this.timeoutMs = params.timeoutMs;

		//component lifetime
		this.mdcSnackbar = null;
	};
	MaterialSnackbar.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-snackbar');
			this.mdcSnackbar = new materialSnackbar.MDCSnackbar(el);
			mdcTools.setMdcComponent(el, this.mdcSnackbar);

			if (this.timeoutMs)
				this.mdcSnackbar.timeoutMs = this.timeoutMs;
			else if (this.button)
				this.mdcSnackbar.timeoutMs = -1;
			else
				this.mdcSnackbar.timeoutMs = 4000; //default paper-toast timeout was 3000, but that's below the range
		},
		'dispose': function() {
			this.mdcSnackbar?.destroy();
		}
	};

	return {
		'viewModel': MaterialSnackbar,
		'template': htmlString
	};
});
