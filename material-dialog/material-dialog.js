﻿define(['text!./material-dialog.html', '../tools/tools', '@material/dialog'],
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
		this.mdcDialog = null;
	};
	MaterialDialog.prototype = {
		'koDescendantsComplete': function(node) {
			const el = $(node).children('.mdc-dialog'); //there can be nested dialogs, make sure we get the right one
			el.find('.mdc-dialog__content').first().attr('id', this.contentId);
			//el.find('.mdc-dialog__actions button').addClass('mdc-dialog__button'); this stacks the buttons vertically
			this.mdcDialog = new materialDialog.MDCDialog(el[0]);
			if (this.modal) {
				this.mdcDialog.scrimClickAction = '';
				this.mdcDialog.escapeKeyAction = '';
			}
			el.data('mdc-dialog', this.mdcDialog);
		},
		'dispose': function() {
			this.mdcDialog.destroy();
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
		'viewModel': MaterialDialog,
		'template': htmlString
	};
});
