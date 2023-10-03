define(['text!./material-checkbox.html', '../tools/tools', '@material/checkbox', '@material/form-field'],
function(htmlString, tools, materialCheckbox, materialFormField) {

	var MaterialCheckbox = function(params) {
		this.checked = params.checked;
		this.clicked = params.clicked;
		this.label = params.label;
		this.noLabel = params.label === undefined;
		this.noink = params.noink;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();
	};
	MaterialCheckbox.prototype = {
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
				const sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					const checkbox = new materialCheckbox.MDCCheckbox($(node).find('.mdc-checkbox')[0]);
					const formField = new materialFormField.MDCFormField($(node).find('.mdc-form-field')[0]);
					formField.input = checkbox;
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
