define(['text!./material-dialog.html', '../tools/tools', '@material/dialog'],
function(htmlString, tools, materialDialog) {

	var MaterialDialog = function(params) {
		this.id = params.id;
		this.title = params.title;
		this.titleId = tools.getGuid();
		this.contentId = tools.getGuid();
		this.closed = params.closed;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcDialog = null;
	};
	MaterialDialog.prototype = {
		'dispose': function() {
			this.mdcDialog.destroy();
			this.bindingSubscription.dispose();
		},
		'onClosed': function(vm, event) {
			if (event.target.id === this.id && typeof this.closed == 'function')
				this.closed();
		},
		'getSurfaceAttrs': function() {
			return {
				'aria-labelledby': this.titleId,
				'aria-describedby': this.contentId
			};
		}
	};

	return {
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialDialog(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					const el = $(node).find('.mdc-dialog');
					el.find('.mdc-dialog__content').attr('id', vm.contentId);
					//el.find('.mdc-dialog__actions button').addClass('mdc-dialog__button'); this stacks the buttons vertically
					vm.mdcDialog = new materialDialog.MDCDialog(el[0]);
					el.data('mdc-dialog', vm.mdcDialog);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
