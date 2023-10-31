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
		this.bindingSubscription = null;
		this.mdcTextField = null;
		this.mdcHelperText = null;
		this.inputSubscription = null;
	};
	MaterialTextField.prototype = {
		'dispose': function() {
			this.inputSubscription.dispose();
			if (this.mdcHelperText)
				this.mdcHelperText.destroy();

			this.mdcTextField.destroy();
			this.bindingSubscription.dispose();
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
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTextField(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					const el = $(node).find('.mdc-text-field');
					vm.mdcTextField = new materialTextfield.MDCTextField(el[0]);
					el.data('mdc-text-field', vm.mdcTextField);
					if (vm.autofocus)
						$(node).find('input').focus();

					if (vm.validate)
						vm.mdcHelperText = new materialTextfield.MDCTextFieldHelperText($(node).find('.mdc-text-field-helper-text')[0]);

					if (vm.value() == chromeAutofillTempValue) {
						//hack to overrule Chrome stupid autofill
						setTimeout(() => {
							vm.value('');
							vm.value.isModified(false);
							$(node).find('.mdc-text-field--invalid').removeClass('mdc-text-field--invalid');
							if (vm.autofocus)
								$(node).find('input').focus();
						}, 100);
					}
					vm.inputSubscription = vm.value.subscribe(() => {
						//necessary hack to update the label style when knockout changes the value
						const shouldFloat = vm.mdcTextField.value.length > 0;
						const foundation = vm.mdcTextField.foundation;
						foundation.notchOutline(shouldFloat);
						foundation.adapter.floatLabel(shouldFloat);
						foundation.styleFloating(shouldFloat);
						if (vm.value.isValid)
							vm.mdcTextField.valid = vm.value.isValid();
					});
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
