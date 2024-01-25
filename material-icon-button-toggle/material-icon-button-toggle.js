define(['text!./material-icon-button-toggle.html', '../tools/tools', '@material/icon-button'],
function(htmlString, tools, materialIconButton) {

	const MaterialIconButtonToggle = function(params) {
		this.value = params.value;
		this.icons = params.icons;
		this.enable = tools.readEnableStatus(params);
		this.id = tools.getGuid();

		//component lifetime
		this.mdcIconButton = null;
		this._valueSubscription = null;
	};
	MaterialIconButtonToggle.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcIconButton = new materialIconButton.MDCIconButtonToggle($(node).find('.mdc-icon-button')[0]);
			this.mdcIconButton.on = this.value();
			this._valueSubscription = this.value.subscribe(newVal => {
				this.mdcIconButton.on = newVal;
			});
		},
		'dispose': function() {
			if (this.mdcIconButton) {
				this._valueSubscription.dispose();
				this.mdcIconButton.destroy();
			}
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
