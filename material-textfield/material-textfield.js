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
	};
	MaterialTextField.prototype = {
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
				const sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					new materialTextfield.MDCTextField($(node).find('.mdc-text-field')[0]);
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
