define(['text!./material-list.html', '@material/list', '@material/ripple'],
function(htmlString, materialList, materialRipple) {

	const MaterialList = function(params) {
		this.fast = params.fast; //prevent ripple effect
		this.avatars = params.avatars;
		this.icons = params.icons;
		this.twoLines = params.twoLines;

		//component lifetime
		this.mdcList = null;
		this.mdcRipples = [];
	};
	MaterialList.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcList = new materialList.MDCList($(node).find('.mdc-deprecated-list')[0]);
			if (!this.fast)
				this.mdcRipples = this.mdcList.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));
		},
		'dispose': function() {
			this.mdcRipples.forEach(ripple => ripple.destroy());
			if (this.mdcList)
				this.mdcList.destroy();
		},

		'getCss': function() {
			return {
				'mdc-deprecated-list--textual-list': !this.avatars && !this.icons,
				'mdc-deprecated-list--avatar-list': this.avatars,
				'mdc-deprecated-list--icon-list': this.icons,
				'mdc-deprecated-list--two-line': this.twoLines
			};
		}
	};

	return {
		'viewModel': MaterialList,
		'template': htmlString
	};
});
