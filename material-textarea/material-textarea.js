define(['text!./material-textarea.html', '../tools/tools', '@material/textfield'],
function(htmlString, tools, materialTextfield) {

	var MaterialTextArea = function(params) {
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
		this.enable = tools.readEnableStatus(params);
		this.labelId = tools.getGuid();
		if (this.validate)
			this.helperId = tools.getGuid();

		//component lifetime
		this.mdcTextField = null;
		this.mdcHelperText = null;
		this.inputSubscription = null;
	};
	MaterialTextArea.prototype = {
		'koDescendantsComplete': function(node) {
			const el = $(node).find('.mdc-text-field');
			this.mdcTextField = new materialTextfield.MDCTextField(el[0]);
			el.data('mdc-text-field', this.mdcTextField);
			if (this.autofocus)
				$(node).find('textarea')[0].focus();

			if (this.validate)
				this.mdcHelperText = new materialTextfield.MDCTextFieldHelperText($(node).find('.mdc-text-field-helper-text')[0]);

			this.inputSubscription = this.value.subscribe(() => {
				//necessary hack to update the label style when knockout changes the value
				const shouldFloat = this.mdcTextField.value.length > 0;
				const foundation = this.mdcTextField.foundation;
				foundation.notchOutline(shouldFloat);
				foundation.adapter.floatLabel(shouldFloat);
				foundation.styleFloating(shouldFloat);
				if (this.value.isValid)
					this.mdcTextField.valid = this.value.isValid();
			});
		},
		'dispose': function() {
			this.inputSubscription.dispose();
			if (this.mdcHelperText)
				this.mdcHelperText.destroy();

			this.mdcTextField.destroy();
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
				'placeholder': this.placeholder,
			};
		}
	};

	return {
		'viewModel': MaterialTextArea,
		'template': htmlString
	};
});
