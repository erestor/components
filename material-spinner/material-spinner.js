define(['text!./material-spinner.html', '@material/circular-progress'],
function(htmlString, materialCircularProgress) {

	var MaterialSpinner = function(params) {
		this.size = ko.unwrap(params.size) || 'large';
		this.label = params.label;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcProgress = null;
	};
	MaterialSpinner.prototype = {
		'dispose': function() {
			this.mdcProgress.destroy();
			this.bindingSubscription.dispose();
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
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialSpinner(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcProgress = new materialCircularProgress.MDCCircularProgress($(node).find('.mdc-circular-progress')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
