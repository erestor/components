define(['text!./toggle-button.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.label = params.label;
		this.value = params.value;
		this.title = params.title;
		this.enable = tools.readEnableStatus(params);
		this.dialogId = tools.getGuid();

		if (params.invert) {
			this.value = ko.computed({
				'read': function() {
					return !params.value();
				},
				'write': function(newValue) {
					params.value(!newValue);
				}
			});
			this.inverted = true;
		}
	};
	ViewModel.prototype = {
		'dispose': function() {
			if (this.inverted)
				this.value.dispose();
		},
		'onChanged': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.checked);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
