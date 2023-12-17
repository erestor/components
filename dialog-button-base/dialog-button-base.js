define(['../tools/tools'], function(tools) {

	var DialogButtonBase = function(params) {
		this.enable = tools.readEnableStatus(params);
		this.dialogId = tools.getGuid();
		this.dialogEl = null;
	};
	DialogButtonBase.prototype = {
		'open': function() {
			if (!this.dialogEl)
				this.dialogEl = $('#' + this.dialogId);

			var mdcDialog = this._getMdcDialog();
			if (mdcDialog)
				mdcDialog.open();
		},
		'close': function() {
			if (this.dialogEl) {
				var mdcDialog = this._getMdcDialog();
				if (mdcDialog)
					mdcDialog.close();
			}
		},
		'_getMdcDialog': function() {
			return this.dialogEl.data('mdc-dialog');
		}
	};
	return DialogButtonBase;
});
