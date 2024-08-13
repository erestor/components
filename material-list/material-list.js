define(['text!./material-list.html', '@knockout-mdc/mdc-tools', '@material/list', '@material/ripple'],
function(htmlString, mdcTools, materialList, materialRipple) {

	const MaterialList = function(params) {
		this.fast = params.fast; //prevent ripple effect
		this.avatars = params.avatars;
		this.icons = params.icons;
		this.twoLines = params.twoLines;

		//component lifetime
		this.mdcList = null;
		this.mdcRipples = [];
		this._mutationObserver = null;
	};
	MaterialList.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			var el = node.querySelector('.mdc-deprecated-list');
			const list = this.mdcList = new materialList.MDCList(el);
			mdcTools.setMdcComponent(el, list);
			if (!this.fast)
				this.mdcRipples = list.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));

			this._mutationObserver = new MutationObserver(() => list.layout());
			this._mutationObserver.observe(list.root, { childList: true, subtree: true });
		},
		'dispose': function() {
			this._mutationObserver?.disconnect();
			this.mdcRipples.forEach(ripple => ripple.destroy());
			this.mdcList?.destroy();
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
