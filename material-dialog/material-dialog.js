define(['text!./material-dialog.html', '../tools/tools.mdc', '../tools/tools', '@material/dialog'],
function(htmlString, mdcTools, tools, materialDialog) {

	const MaterialDialog = function(params) {
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
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-dialog');
			el.querySelector('.mdc-dialog__content').id = this.contentId;

			this.mdcDialog = new materialDialog.MDCDialog(el);
			mdcTools.setMdcComponent(el, this.mdcDialog);

			if (this.modal) {
				this.mdcDialog.scrimClickAction = '';
				this.mdcDialog.escapeKeyAction = '';
			}
		},
		'dispose': function() {
			this.mdcDialog?.destroy();
		},

		'onOpened': function(vm, event) {
			const dialogEl = document.getElementById(this.id);
			const defaultEl = dialogEl.querySelector('.mdc-dialog__container .mdc-dialog__surface .mdc-dialog__actions button[data-mdc-dialog-button-default]');
			if (defaultEl)
				defaultEl.focus();
			else {
				const autofocusEl = dialogEl.querySelector('[autofocus]');
				autofocusEl?.focus();
			}
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
