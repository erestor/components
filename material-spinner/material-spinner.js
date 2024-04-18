define(['text!./material-spinner.html', '@material/circular-progress'],
function(htmlString, materialCircularProgress) {

	const MaterialSpinner = function(params) {
		this.size = ko.unwrap(params.size) || 'large';
		this.label = params.label;

		//component lifetime
		this.mdcProgress = null;
	};
	MaterialSpinner.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcProgress = new materialCircularProgress.MDCCircularProgress(node.querySelector('.mdc-circular-progress'));
		},
		'dispose': function() {
			this.mdcProgress?.destroy();
		},

		'getAttrs': function() {
			return {
				'aria-label': this.label,
			};
		},
		'getCss': function() {
			return {
				'mdc-circular-progress--indeterminate': true,
				'mdc-circular-progress--large': this.size === 'large',
				'mdc-circular-progress--medium': this.size === 'medium',
				'mdc-circular-progress--small': this.size === 'small',
			};
		}
	};

	return {
		'viewModel': MaterialSpinner,
		'template': htmlString
	};
});
