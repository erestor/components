define(['text!./checkbox-x.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.checked = params.checked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.disable = params.disable !== undefined ? params.disable : false;
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
