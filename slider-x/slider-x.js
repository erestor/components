define(['text!./slider-x.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.min = params.min || 0;
		this.max = params.max || 100;
		this.secondaryProgress = params.secondaryProgress || 0;
		this.value = params.value;
		this.pin = params.pin;
		this.enable = params.enable !== undefined ? params.enable : true;
		this.dialogId = tools.getGuid();
	};
	ViewModel.prototype = {
		'onChanged': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.value);
		},
		'onImmediateChange': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.immediateValue);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
