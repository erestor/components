define(['text!./material-button.html', '../tools/tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	var MaterialButton = function(params) {
		//data binding
		this.click = params.click;
		this.enable = tools.readEnableStatus(params);

		//css
		this.outlined = params.outlined;
		this.raised = params.raised;

		//attributes
		this.autofocus = params.autofocus;
		this.default = params.default;

		//component lifetime
		this.bindingSubscription = null;
		this.mdcRipple = null;
	};
	MaterialButton.prototype = {
		'dispose': function() {
			this.mdcRipple.destroy();
			this.bindingSubscription.dispose();
		},
		'getAttrs': function() {
			return {
				'aria-disabled': !this.enable(),
				'autofocus': this.autofocus ? '' : undefined,
				'data-mdc-dialog-button-default': this.default ? '' : undefined,
			};
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
					const el = $(node).find('.mdc-button')[0];
					vm.mdcRipple = new materialRipple.MDCRipple(el);
					if (vm.autofocus)
						el.focus();
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
