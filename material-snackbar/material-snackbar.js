define(['text!./material-snackbar.html', '@material/snackbar'],
function(htmlString, materialSnackbar) {

	var MaterialSnackbar = function(params) {
		this.id = params.id;
		this.label = params.label;
		this.button = params.button;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcSnackbar = null;
	};
	MaterialSnackbar.prototype = {
		'dispose': function() {
			this.mdcSnackbar.destroy();
			this.bindingSubscription.dispose();
		}
	};

	return {
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialSnackbar(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					const el = $(node).find('.mdc-snackbar');
					vm.mdcSnackbar = new materialSnackbar.MDCSnackbar(el[0]);
					if (params.timeoutMs)
						vm.mdcSnackbar.timeoutMs = params.timeoutMs;
					else if (params.button)
						vm.mdcSnackbar.timeoutMs = -1;
					else
						vm.mdcSnackbar.timeoutMs = 4000; //default paper-toast timeout was 3000, but that's below the range

					el.data('mdc-snackbar', vm.mdcSnackbar); //this is necessary to allow opening the snackbar from outside the component
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
