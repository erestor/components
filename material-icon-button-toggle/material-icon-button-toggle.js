define(['text!./material-icon-button-toggle.html', '../tools/tools', '@material/icon-button'],
function(htmlString, tools, materialIconButton) {

	var MaterialIconButtonToggle = function(params) {
		this.value = params.value;
		this.icons = params.icons;
		this.titles = params.titles;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		//component lifetime
		this.mdcIconButton = null;
		this.valueSubscription = null;
	};
	MaterialIconButtonToggle.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcIconButton = new materialIconButton.MDCIconButtonToggle($(node).find('.mdc-icon-button')[0]);
			this.mdcIconButton.on = this.value();
			this.valueSubscription = this.value.subscribe(newVal => {
				this.mdcIconButton.on = newVal;
			});
		},
		'dispose': function() {
			this.valueSubscription.dispose();
			this.mdcIconButton.destroy();
		},

		'onChange': function(vm, event) {
			this.value(event.detail.isOn);
		}
	};

	return {
		'viewModel': MaterialIconButtonToggle,
		'template': htmlString
	};
});
