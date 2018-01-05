define(['text!./checkbox-x.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.checked = params.checked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();
	};
	ViewModel.prototype = {
		'onChanged': function() {
			var d = $('#' + this.id)[0];
			this.checked(d.checked);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
