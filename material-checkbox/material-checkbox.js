define(['text!./material-checkbox.html', '../tools/tools', '@material/checkbox', '@material/form-field'],
function(htmlString, tools, materialCheckbox, materialFormField) {

	const MaterialCheckbox = function(params) {
		this.checked = params.checked;
		this.clicked = params.clicked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		//component lifetime
		this.mdcCheckbox = null;
		this.mdcFormField = null;
	};
	MaterialCheckbox.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcCheckbox = new materialCheckbox.MDCCheckbox($(node).find('.mdc-checkbox')[0]);
			this.mdcFormField = new materialFormField.MDCFormField($(node).find('.mdc-form-field')[0]);
			this.mdcFormField.input = this.mdcCheckbox;
		},
		'dispose': function() {
			this.mdcFormField.destroy();
			this.mdcCheckbox.destroy();
		},

		'onTapped': function(vm, ev) {
			if (this.clicked)
				this.clicked(this.checked, ev);

			return true;
		}
	};

	return {
		'viewModel': MaterialCheckbox,
		'template': htmlString
	};
});
