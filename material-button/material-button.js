define(['text!./material-button.html', '@skolaris/knockout-tools', '@material/ripple'],
function(htmlString, tools, materialRipple) {

	const MaterialButton = function(params) {
		//data binding
		this.click = params.click;
		this.enable = tools.isComponentEnabled(params);
		this.type = params.type;

		//css
		this.outlined = params.outlined;
		this.raised = params.raised;

		//attributes
		this.autofocus = params.autofocus;
		this.default = params.default;

		//component lifetime
		this.mdcRipple = null;
	};
	MaterialButton.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			const el = node.querySelector('.mdc-button');
			this.mdcRipple = new materialRipple.MDCRipple(el);
			if (this.autofocus)
				el.focus();
		},
		'dispose': function() {
			this.mdcRipple?.destroy();
		},

		'getAttrs': function() {
			return {
				'aria-disabled': !this.enable(),
				'autofocus': this.autofocus ? '' : undefined,
				'data-mdc-dialog-button-default': (this.autofocus || this.default) ? '' : undefined,
				'type': this.type
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
		'viewModel': MaterialButton,
		'template': htmlString
	};
});
