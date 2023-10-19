define(['text!./material-button.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialButton = function(params) {
		//attributes
		this.autofocus = params.autofocus;

		//css
		this.outlined = params.outlined;
		this.raised = params.raised;

		//data binding
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);

		//component lifetime
		this.bindingSubscription = null;
		this.mdcRipple = null;
	};
	MaterialButton.prototype = {
		'dispose': function() {
			this.mdcRipple.destroy();
			this.bindingSubscription.dispose();
		},
		'getCss': function() {
			return {
				'mdc-button--outlined': ko.unwrap(this.outlined),
				'mdc-button--raised': ko.unwrap(this.raised)
			};
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialButton(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcRipple = new materialRipple.MDCRipple($(node).find('.mdc-button')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
