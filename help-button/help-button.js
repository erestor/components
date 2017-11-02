define(['text!./help-button.html', '../tools/tools'],
	function(htmlString, tools) {

	var ViewModel = function(params) {
		this.content = params.content;
		this.title = params.title;
		this.data = params.data; //for templated version
		this.noPosition = params.noPosition;
		this.icon = params.outline ? 'icons:help-outline' : 'icons:help';
		this.dialogId = tools.getGuid();
		this.dialogEl = null;
	};
	ViewModel.prototype = {
		'open': function() {
			if (!this.dialogEl)
				this.dialogEl = $('#' + this.dialogId).appendTo($('body')); //must put the dialog in the body to ensure proper stacking

			var d = this.dialogEl[0];
			if (d.__isAnimating) {
				//this is an unfortunate hack to prevent re-opening the dialog on click while it's closing as a result of polymer handler
				return;
			}
			if (!this.noPosition)
				d.positionTarget = $('.' + this.dialogId)[0]; //looking for a class(!)

			d.open();
		},
		'dispose': function() {
			if (this.dialogEl)
				this.dialogEl.remove();
		}
	};
    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
