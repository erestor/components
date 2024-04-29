define(['text!./material-textarea.html', '@skolaris/knockout-tools', '@knockout-mdc/mdc-tools', '@material/textfield'],
function(htmlString, tools, mdcTools, materialTextfield) {

	const MaterialTextArea = function(params) {
		//attributes
		this.id = params.id;
		this.autofocus = params.autofocus;
		this.label = params.label;
		this.placeholder = params.placeholder;
		this.rows = params.rows;
		this.cols = params.cols;

		//css
		this.filled = ko.unwrap(params.filled);
		this.noLabel = ko.pureComputed(() => !ko.unwrap(params.label));

		//data binding
		this.value = params.textInput || ko.observable(ko.unwrap(params.initialValue));
		this.validate = params.validate;
		this.enable = tools.isComponentEnabled(params);
		this.labelId = tools.getGuid();
		if (this.validate)
			this.helperId = tools.getGuid();

		//component lifetime
		this.mdcTextField = null;
		this.mdcHelperText = null;
		this._inputSubscription = null;
	};
	MaterialTextArea.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-text-field');
			this.mdcTextField = new materialTextfield.MDCTextField(el);
			mdcTools.setMdcComponent(el, this.mdcTextField);

			if (this.autofocus)
				node.querySelector('textarea').focus();

			if (this.validate)
				this.mdcHelperText = new materialTextfield.MDCTextFieldHelperText(node.querySelector('.mdc-text-field-helper-text'));

			this._inputSubscription = this.value.subscribe(() => {
				//necessary hack to update the label style when knockout changes the value
				const shouldFloat = this.mdcTextField.value.length > 0;
				const foundation = this.mdcTextField.foundation;
				foundation.notchOutline(shouldFloat);
				foundation.adapter.floatLabel(shouldFloat);
				foundation.styleFloating(shouldFloat);
				if (this.value.isValid)
					this.mdcTextField.valid = this.value.isValid(); //NOTE: this will not work if ko.option.deferUpdates is true, as the validation will not have run yet
			});
		},
		'dispose': function() {
			this._inputSubscription?.dispose();
			this.mdcHelperText?.destroy();
			this.mdcTextField?.destroy();
		},

		'getCss': function() {
			return {
				'mdc-text-field--filled': this.filled,
				'mdc-text-field--outlined': !this.filled,
				'mdc-text-field--disabled': !this.enable(),
				'mdc-text-field--no-label': this.noLabel()
			};
		},
		'getInputAttrs': function() {
			return {
				'rows': this.rows,
				'cols': this.cols,
				'aria-labelledby': this.labelId,
				'aria-controls': this.validate ? this.helperId : undefined,
				'autofocus': this.autofocus,
				'placeholder': this.placeholder
			};
		}
	};

	return {
		'viewModel': MaterialTextArea,
		'template': htmlString
	};
});
