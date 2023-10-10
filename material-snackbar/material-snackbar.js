﻿define(['text!./material-snackbar.html', '@material/snackbar'],
function(htmlString, materialSnackbar) {

	var MaterialSnackbar = function(params) {
		this.label = params.label;
		this.button = params.button;
	};

	return {
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialSnackbar(params);
				var sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					const $node = $(node);
					const snackbar = new materialSnackbar.MDCSnackbar($node.find('.mdc-snackbar')[0]);
					if (params.timeoutMs)
						snackbar.timeoutMs = params.timeoutMs;
					else if (params.button)
						snackbar.timeoutMs = -1;
					else
						snackbar.timeoutMs = 4000; //default paper-toast timeout was 3000, but that's below the range

					$node.data('mdc-snackbar', snackbar); //this is necessary to allow opening the snackbar from outside the component
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});