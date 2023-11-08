define(['text!./material-progress.html', '@material/linear-progress'],
function(htmlString, materialLinearProgress) {

	var MaterialProgress = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.indeterminate = params.indeterminate;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcLinearProgress = null;
		this.valueSubscription = null;
	};
	MaterialProgress.prototype = {
		'dispose': function() {
			if (this.valueSubscription)
				this.valueSubscription.dispose();

			this.mdcLinearProgress.destroy();
			this.bindingSubscription.dispose();
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
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialProgress(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcLinearProgress = new materialLinearProgress.MDCLinearProgress($(node).find('.mdc-linear-progress')[0]);
					if (vm.value) {
						vm.mdcLinearProgress.progress = ko.unwrap(vm.value);
						vm.valueSubscription = vm.value.subscribe(newVal => {
							vm.mdcLinearProgress.progress = newVal;
						});
					}
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
