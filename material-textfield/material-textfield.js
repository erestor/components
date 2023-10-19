define(['text!./material-textfield.html', '../tools/tools', '@material/textfield'],
function(htmlString, tools, materialTextfield) {

	var MaterialTextField = function(params) {
		//attributes
		this.autofocus = params.autofocus;

		//css
		this.filled = ko.unwrap(params.filled);

		//data binding
		this.value = params.textInput;
		this.type = params.type;
		this.step = params.step || 1; //for number input
		this.label = params.label;
		this.enable = tools.readEnableStatus(params);
		this.labelId = tools.getGuid();

		//component lifetime
		this.bindingSubscription = null;
		this.mdcTextField = null;
		this.inputSubscription = null;
	};
	MaterialTextField.prototype = {
		'dispose': function() {
			this.inputSubscription.dispose();
			this.mdcTextField.destroy();
			this.bindingSubscription.dispose();
		},
		'getCss': function() {
			return {
				'mdc-text-field--filled': this.filled,
				'mdc-text-field--outlined': !this.filled,
				'mdc-text-field--disabled': !this.enable()
			};
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialTextField(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcTextField = new materialTextfield.MDCTextField($(node).find('.mdc-text-field')[0]);
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
