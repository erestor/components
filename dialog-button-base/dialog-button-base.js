define(['@skolaris/knockout-tools', '@knockout-mdc/mdc-tools'], function(tools, mdcTools) {

	var DialogButtonBase = function(params) {
		this.enable = tools.isComponentEnabled(params);
		this.dialogId = tools.getGuid();
	};
	DialogButtonBase.prototype = {
		'open': function() {
			const mdcDialog = this._getMdcDialog();
			mdcDialog?.open();
		},
		'close': function() {
			const mdcDialog = this._getMdcDialog();
			mdcDialog?.close();
		},
		'_getMdcDialog': function() {
			const el = document.getElementById(this.dialogId);
			return mdcTools.getMdcComponent(el);
		}
	};
	return DialogButtonBase;
});
