﻿define(['text!./color-picker.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.color = params.color;
		this.dialogId = tools.getGuid();
	};
	ViewModel.prototype = {
		'onSelected': function() {
			var d = $('#' + this.dialogId)[0];
			this.color(d.color);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});