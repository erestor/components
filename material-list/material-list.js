define(['text!./material-list.html', '@material/list', '@material/ripple'],
function(htmlString, materialList, materialRipple) {

	const MaterialList = function(params) {
		this.fast = params.fast; //prevent ripple effect
		this.icons = params.icons;

		//component lifetime
		this.mdcList = null;
		this.mdcRipples = [];
	};
	MaterialList.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcList = new materialList.MDCList($(node).find('.mdc-deprecated-list')[0]);
			if (!this.fast)
				this.mdcRipples = this.mdcList.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));
		},
		'dispose': function() {
			this.mdcRipples.forEach(ripple => ripple.destroy());
			this.mdcList.destroy();
		},

		'getCss': function() {
			return {
				'mdc-deprecated-list--icon-list': this.icons
			};
		}
	};

	return {
		'viewModel': MaterialList,
		'template': htmlString
	};
});
