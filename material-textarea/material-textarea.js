define(['text!./material-textarea.html', '../tools/tools', '@material/textfield'],
function(htmlString, tools, materialTextfield) {

	var MaterialTextArea = function(params) {
		//attributes
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
		this.bindingSubscription = null;
		this.mdcTextField = null;
		this.mdcHelperText = null;
		this.inputSubscription = null;
	};
	MaterialTextArea.prototype = {
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
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTextArea(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcTextField = new materialTextfield.MDCTextField($(node).find('.mdc-text-field')[0]);
					$(node).data('mdc-text-field', vm.mdcTextField);
					if (vm.autofocus)
						$(node).find('textarea').focus();

					if (vm.validate)
						vm.mdcHelperText = new materialTextfield.MDCTextFieldHelperText($(node).find('.mdc-text-field-helper-text')[0]);

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
