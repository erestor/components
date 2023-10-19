define(['text!./material-icon-button-toggle.html', '../tools/tools', '@material/icon-button'],
function(htmlString, tools, materialIconButton) {

	var MaterialIconButtonToggle = function(params) {
		this.value = params.value;
		this.icons = params.icons;
		this.titles = params.titles;
		this.enable = tools.readEnableStatus(params);

		//component lifetime
		this.bindingSubscription = null;
		this.mdcIconButton = null;
	};
	MaterialIconButtonToggle.prototype = {
		'dispose': function() {
			this.mdcIconButton.destroy();
			this.bindingSubscription.dispose();
		},
		'toggle': function() {
			this.value(!this.value());
		},
		'getCss': function() {
			return {
				'mdc-icon-button--on': this.value()
			};
		}
	};

	return {
		'viewModel': {
			createViewModel: function(params, componentInfo) {
				var vm = new MaterialIconButtonToggle(params);
				vm.bindingSubscription = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					vm.mdcIconButton = new materialIconButton.MDCIconButtonToggle($(node).find('.mdc-icon-button')[0]);
				});
				return vm;
			}
		},
		'template': htmlString
	};
});
