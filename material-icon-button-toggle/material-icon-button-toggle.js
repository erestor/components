define(['text!./material-icon-button-toggle.html', '../tools/tools', '@material/icon-button'],
function(htmlString, tools, materialIconButton) {

	var MaterialIconButtonToggle = function(params) {
		this.value = params.value;
		this.icons = params.icons;
		this.titles = params.titles;
		this.enable = tools.readEnableStatus(params);
	};
	MaterialIconButtonToggle.prototype = {
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
				const sub = ko.bindingEvent.subscribe(componentInfo.element, 'descendantsComplete', node => {
					new materialIconButton.MDCIconButtonToggle($(node).find('.mdc-icon-button')[0]);
				});
				vm.dispose = () => sub.dispose();
				return vm;
			}
		},
		'template': htmlString
	};
});
