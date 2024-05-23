define(['text!./material-banner.html', '@skolaris/knockout-tools'],
function(htmlString, tools) {

	const MaterialBanner = function(params) {
		this.icon = params.icon;
		this.text = params.text;
		this.buttons = params.buttons;
		this.show = params.show;
		this.dismissed = params.dismissed;
		this.id = tools.getGuid();

		const onButtonClick = index => {
			if (this.buttons[index].dismiss)
				this._hide();

			if (typeof this.buttons[index].click === 'function')
				this.buttons[index].click();
		};
		this.onButton0 = () => onButtonClick(0);
		this.onButton1 = () => onButtonClick(1);
	};
	MaterialBanner.prototype = {
		'_hide': function() {
			this.dismissed(true);
		}
	};

	return {
		'viewModel': MaterialBanner,
		'template': htmlString
	};
});
