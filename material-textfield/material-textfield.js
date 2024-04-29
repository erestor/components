define(['text!./material-textfield.html', '@skolaris/knockout-tools', '@knockout-mdc/mdc-tools', '@material/textfield'],
function(htmlString, tools, mdcTools, materialTextfield) {

	const chromeAutofillTempValue = '__prevent_autofill__';

	const MaterialTextField = function(params) {
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
		this.enable = tools.isComponentEnabled(params);
		this.labelId = tools.getGuid();
		if (this.validate)
			this.helperId = tools.getGuid();

		//chrome autofill workaround
		if (params.autofill == 'off' && !this.value())
			this.value(chromeAutofillTempValue);

		//component lifetime
		this.mdcTextField = null;
		this._valueSubscription = null;
		this._requiredSubscription = null;
	};
	MaterialTextField.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-text-field');
			this.mdcTextField = new materialTextfield.MDCTextField(el);
			mdcTools.setMdcComponent(el, this.mdcTextField);

			if (this.autofocus)
				node.querySelector('input').focus();

			if (this.value() == chromeAutofillTempValue) {
				//hack to overrule Chrome stupid autofill
				setTimeout(() => {
					this.value('');
					this.value.isModified(false);
					node.querySelector('.mdc-text-field--invalid')?.classList.remove('mdc-text-field--invalid');
					if (this.autofocus)
						node.querySelector('input').focus();
				}, 100);
			}
			this._valueSubscription = this.value.subscribe(() => {
				//necessary hack to update the label style when knockout changes the value
				const shouldFloat = this.mdcTextField.value.length > 0;
				const foundation = this.mdcTextField.foundation;
				foundation.notchOutline(shouldFloat);
				foundation.adapter.floatLabel(shouldFloat);
				foundation.styleFloating(shouldFloat);
				if (this.value.isValid)
					this.mdcTextField.valid = this.value.isValid(); //NOTE: this will not work if ko.option.deferUpdates is true, as the validation will not have run yet
			});

			this.mdcTextField.required = ko.unwrap(this.required);
			if (ko.isObservable(this.required)) {
				this._requiredSubscription = this.required.subscribe(() => {
					this.mdcTextField.required = this.required();
				});
			}
		},
		'dispose': function() {
			this._requiredSubscription?.dispose();
			this._valueSubscription?.dispose();
			this.mdcTextField?.destroy();
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
				'placeholder': this.placeholder
			};
		}
	};

	return {
		'viewModel': MaterialTextField,
		'template': htmlString
	};
});
