define(['../tools/tools'], function(tools) {

	var DialogButtonBase = function(params) {
		this.content = params.content;
		this.enable = tools.readEnableStatus(params);
		this.title = params.title;
		this.data = params.data; //for templated version
		this.dialogId = tools.getGuid();
		this.dialogEl = null;
	};
	DialogButtonBase.prototype = {
		'open': function() {
			if (!this.dialogEl)
				this.dialogEl = $('#' + this.dialogId);

			var mdcDialog = this.dialogEl.data('mdc-dialog');
			if (mdcDialog)
				mdcDialog.open();
		}
	};
	return DialogButtonBase;
});
