define(['text!./material-checkbox.html', '../tools/tools'],
function(htmlString, tools) {

	var MaterialCheckbox = function(params) {
		this.checked = params.checked;
		this.clicked = params.clicked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.noink = params.noink;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();
	};
	MaterialCheckbox.prototype = {
		'onChanged': function() {
			var d = $('#' + this.id)[0];
			this.checked(d.checked);
		},
		'onTapped': function(vm, ev) {
			if (this.clicked)
				this.clicked(this.checked, ev);
		}
	};

	return {
		'viewModel': MaterialCheckbox,
		'template': htmlString
	};
});
