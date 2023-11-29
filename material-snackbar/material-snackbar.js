define(['text!./material-snackbar.html', '@material/snackbar'],
function(htmlString, materialSnackbar) {

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
			const el = $(node).find('.mdc-snackbar');
			this.mdcSnackbar = new materialSnackbar.MDCSnackbar(el[0]);
			if (this.timeoutMs)
				this.mdcSnackbar.timeoutMs = this.timeoutMs;
			else if (this.button)
				this.mdcSnackbar.timeoutMs = -1;
			else
				this.mdcSnackbar.timeoutMs = 4000; //default paper-toast timeout was 3000, but that's below the range

			el.data('mdc-snackbar', this.mdcSnackbar); //this is necessary to allow opening the snackbar from outside the component
		},
		'dispose': function() {
			this.mdcSnackbar.destroy();
		}
	};

	return {
		'viewModel': MaterialSnackbar,
		'template': htmlString
	};
});
