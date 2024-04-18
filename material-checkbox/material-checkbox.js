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
			if (!node.isConnected)
				return;

			this.mdcCheckbox = new materialCheckbox.MDCCheckbox(node.querySelector('.mdc-checkbox'));
			this.mdcFormField = new materialFormField.MDCFormField(node.querySelector('.mdc-form-field'));
			this.mdcFormField.input = this.mdcCheckbox;
		},
		'dispose': function() {
			this.mdcFormField?.destroy();
			this.mdcCheckbox?.destroy();
		},

		'onClicked': function(vm, event) {
			setTimeout(() => {
				if (this.clicked)
					this.clicked(this.checked, event);
			});
			return true;
		}
	};

	return {
		'viewModel': MaterialCheckbox,
		'template': htmlString
	};
});
