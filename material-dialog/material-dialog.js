define(['text!./material-dialog.html', '../tools/tools', '@material/dialog'],
function(htmlString, tools, materialDialog) {

	var MaterialDialog = function(params) {
		this.id = params.id;
		this.title = params.title;
		this.modal = params.modal;
		this.titleId = tools.getGuid();
		this.contentId = tools.getGuid();
		this.opened = params.opened;
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
		'onOpened': function(vm, event) {
			$('#' + this.id).find('button[data-mdc-dialog-button-default]').focus();
			if (typeof this.opened == 'function')
				this.opened(vm, event);
		},
		'onClosed': function(vm, event) {
			if (typeof this.closed == 'function')
				this.closed(vm, event);
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
					const el = $(node).children('.mdc-dialog'); //there can be nested dialogs, make sure we get the right one
					el.find('.mdc-dialog__content').first().attr('id', vm.contentId);
					//el.find('.mdc-dialog__actions button').addClass('mdc-dialog__button'); this stacks the buttons vertically
					vm.mdcDialog = new materialDialog.MDCDialog(el[0]);
					if (vm.modal) {
						vm.mdcDialog.scrimClickAction = '';
						vm.mdcDialog.escapeKeyAction = '';
					}
					el.data('mdc-dialog', vm.mdcDialog);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
