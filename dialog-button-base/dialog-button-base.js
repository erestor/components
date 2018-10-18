define(['../tools/tools'],
	function(tools) {

	var DialogButtonBase = function(params) {
		this.content = params.content;
		this.enable = tools.readEnableStatus(params);
		this.title = params.title;
		this.data = params.data; //for templated version
		this.noPosition = params.noPosition;
		this.dialogId = tools.getGuid();
		this.dialogEl = null;
	};
	DialogButtonBase.prototype = {
		'open': function() {
			if (!this.dialogEl)
				this.dialogEl = $('#' + this.dialogId);

			var d = this.dialogEl[0];
			if (d.__isAnimating) {
				//this is an unfortunate hack to prevent re-opening the dialog on click while it's closing as a result of polymer handler
				return;
			}
			if (!this.noPosition)
				d.positionTarget = $('.' + this.dialogId)[0]; //looking for a class(!)

			d.open();
		}
	};
	return DialogButtonBase;
});
