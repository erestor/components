define(['text!./material-checkbox.html', '../tools/tools', '@material/checkbox', '@material/form-field'],
function(htmlString, tools, materialCheckbox, materialFormField) {

	var MaterialCheckbox = function(params) {
		this.checked = params.checked;
		this.clicked = params.clicked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		//component lifetime
		this.bindingSubscription = null;
		this.mdcCheckbox = null;
		this.mdcFormField = null;
	};
	MaterialCheckbox.prototype = {
		'dispose': function() {
			this.mdcFormField.destroy();
			this.mdcCheckbox.destroy();
			this.bindingSubscription.dispose();
		},
		'onTapped': function(vm, ev) {
			if (this.clicked)
				this.clicked(this.checked, ev);

			return true;
		}
	};

	return {
		'viewModel': {
			'createViewModel': function(params, componentInfo) {
				var vm = new MaterialCheckbox(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcCheckbox = new materialCheckbox.MDCCheckbox($(node).find('.mdc-checkbox')[0]);
					vm.mdcFormField = new materialFormField.MDCFormField($(node).find('.mdc-form-field')[0]);
					vm.mdcFormField.input = vm.mdcCheckbox;
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
