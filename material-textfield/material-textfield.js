define(['text!./material-textfield.html', '../tools/tools', '@material/textfield'],
function(htmlString, tools, materialTextfield) {

	const chromeAutofillTempValue = '__prevent_autofill__';

	var MaterialTextField = function(params) {
		//attributes
		this.id = params.id;
		this.autofocus = params.autofocus;
		this.label = params.label;
		this.placeholder = params.placeholder;
		this.required = params.required;
		this.step = params.step || (params.type == 'number' ? 1 : undefined);
		this.type = params.type;

		//css
		this.filled = ko.unwrap(params.filled);
		this.noLabel = ko.pureComputed(() => !ko.unwrap(params.label));

		//data binding
		this.value = params.textInput || ko.observable(ko.unwrap(params.initialValue));
		this.leadingIcon = params.leadingIcon;
		this.prefix = params.prefix;
		this.suffix = params.suffix;
		this.validate = params.validate;
		this.enable = tools.readEnableStatus(params);
		this.labelId = tools.getGuid();
		if (this.validate)
			this.helperId = tools.getGuid();

		//chrome autofill workaround
		if (params.autofill == 'off' && !this.value())
			this.value(chromeAutofillTempValue);

		//component lifetime
		this.mdcTextField = null;
		this.mdcHelperText = null;
		this.valueSubscription = null;
	};
	MaterialTextField.prototype = {
		'koDescendantsComplete': function(node) {
			const el = $(node).find('.mdc-text-field');
			this.mdcTextField = new materialTextfield.MDCTextField(el[0]);
			el.data('mdc-text-field', this.mdcTextField);
			if (this.autofocus)
				$(node).find('input').focus();

			if (this.validate)
				this.mdcHelperText = new materialTextfield.MDCTextFieldHelperText($(node).find('.mdc-text-field-helper-text')[0]);

			if (this.value() == chromeAutofillTempValue) {
				//hack to overrule Chrome stupid autofill
				setTimeout(() => {
					this.value('');
					this.value.isModified(false);
					$(node).find('.mdc-text-field--invalid').removeClass('mdc-text-field--invalid');
					if (this.autofocus)
						$(node).find('input').focus();
				}, 100);
			}
			this.valueSubscription = this.value.subscribe(() => {
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
			this.valueSubscription.dispose();
			if (this.mdcHelperText)
				this.mdcHelperText.destroy();

			this.mdcTextField.destroy();
		},

		'getCss': function() {
			return {
				'mdc-text-field--filled': this.filled,
				'mdc-text-field--outlined': !this.filled,
				'mdc-text-field--disabled': !this.enable(),
				'mdc-text-field--no-label': this.noLabel(),
				'mdc-text-field--with-leading-icon': this.leadingIcon
			};
		},
		'getInputAttrs': function() {
			return {
				'type': this.type,
				'step': this.step,
				'aria-labelledby': this.labelId,
				'aria-controls': this.validate ? this.helperId : undefined,
				'autofocus': this.autofocus,
				'placeholder': this.placeholder,
				'required': this.required
			};
		}
	};

	return {
		'viewModel': MaterialTextField,
		'template': htmlString
	};
});
