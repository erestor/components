define(['text!./material-list.html', '@material/list', '@material/ripple'],
function(htmlString, materialList, materialRipple) {

	const MaterialList = function(params) {
		this.fast = params.fast; //prevent ripple effect
		this.avatars = params.avatars;
		this.icons = params.icons;
		this.twoLines = params.twoLines;

		//component lifetime
		this.observer = null;
		this.mdcList = null;
		this.mdcRipples = [];
	};
	MaterialList.prototype = {
		'koDescendantsComplete': function(node) {
			//mdc-list is often hidden behind a menu button,
			//so it's better to defer initialization till it's visible
			this.observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						this._init(entry.target);
						this.observer.disconnect();
						this.observer = null;
					}
				});
			});
			this.observer.observe(node);
		},
		'dispose': function() {
			if (this.observer)
				this.observer.disconnect();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			if (this.mdcList)
				this.mdcList.destroy();
		},

		'getCss': function() {
			return {
				'mdc-deprecated-list--avatar-list': this.avatars,
				'mdc-deprecated-list--icon-list': this.icons,
				'mdc-deprecated-list--two-line': this.twoLines
			};
		},

		'_init': function(node) {
			this.mdcList = new materialList.MDCList($(node).find('.mdc-deprecated-list')[0]);
			if (!this.fast)
				this.mdcRipples = this.mdcList.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));
		}
	};

	return {
		'viewModel': MaterialList,
		'template': htmlString
	};
});
