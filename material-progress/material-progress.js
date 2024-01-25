﻿define(['text!./material-progress.html', '@material/linear-progress'],
function(htmlString, materialLinearProgress) {

	const MaterialProgress = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.indeterminate = params.indeterminate;

		//component lifetime
		this.mdcLinearProgress = null;
		this._valueSubscription = null;
	};
	MaterialProgress.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcLinearProgress = new materialLinearProgress.MDCLinearProgress($(node).find('.mdc-linear-progress')[0]);
			if (this.value) {
				this.mdcLinearProgress.progress = this.value();
				this._valueSubscription = this.value.subscribe(newVal => {
					this.mdcLinearProgress.progress = newVal;
				});
			}
		},
		'dispose': function() {
			if (this._valueSubscription)
				this._valueSubscription.dispose();

			if (this.mdcLinearProgress)
				this.mdcLinearProgress.destroy();
		},

		'getAttrs': function() {
			return {
				'aria-label': this.label
			};
		},
		'getCss': function() {
			return {
				'mdc-linear-progress--indeterminate': this.indeterminate,
			};
		}
	};

	return {
		'viewModel': MaterialProgress,
		'template': htmlString
	};
});
