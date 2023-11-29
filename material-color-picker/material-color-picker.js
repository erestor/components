define(['text!./material-color-picker.html', '../tools/tools'],
function(htmlString, tools) {

	const MaterialColorPicker = function(params) {
		this.color = params.color;
		this.halign = params.halign;
		this.dialogId = tools.getGuid();
	};
	MaterialColorPicker.prototype = {
		'onSelected': function() {
			var d = $('#' + this.dialogId)[0];
			this.color(d.color);
		}
	};

	return {
		'viewModel': MaterialColorPicker,
		'template': htmlString
	};
});
