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
	};
	MaterialButton.prototype = {
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
				var sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', function(node) {
					new materialRipple.MDCRipple($(node).find('.mdc-button')[0]);
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
