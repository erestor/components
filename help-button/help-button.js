define(['text!./help-button.html', '../tools/tools'],
	function(htmlString, tools) {

	var ViewModel = function(params) {
		this.content = params.content;
		this.title = params.title;
		this.data = params.data; //for templated version
		this.noPosition = params.noPosition;
		this.dialogId = tools.getGuid();
	};
	ViewModel.prototype = {
		'open': function() {
			var d = $('#' + this.dialogId)[0];
			if (d.__isAnimating) {
				//this is an unfortunate hack to prevent re-opening the dialog on click while it's closing as a result of polymer handler
				return;
			}
			if (!this.noPosition)
				d.positionTarget = $('.' + this.dialogId)[0];

			d.open();
		}
	};
    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
