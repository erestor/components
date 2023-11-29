define(['text!./material-listbox.html', '@material/list', '@material/ripple'],
function(htmlString, materialList, materialRipple) {

	const MaterialListbox = function(params) {
		this.selected = params.selected;

		//component lifetime
		this.mdcList = null;
		this.mdcRipples = null;
		this.selectedSubscription = null;
	};
	MaterialListbox.prototype = {
		'koDescendantsComplete': function(node) {
			this.mdcList = new materialList.MDCList($(node).find('.mdc-list')[0]);
			this.mdcRipples = this.mdcList.listElements.map(listItemEl => new materialRipple.MDCRipple(listItemEl));
			this.mdcList.singleSelection = true;
			this.mdcList.selectedIndex = ko.unwrap(this.selected);
			this.selectedSubscription = this.selected.subscribe(newVal => {
				this.mdcList.selectedIndex = newVal;
			});
		},
		'dispose': function() {
			if (this.selectedSubscription)
				this.selectedSubscription.dispose();

			this.mdcRipples.forEach(ripple => ripple.destroy());
			this.mdcList.destroy();
		},

		'getAttrs': function() {
			return {
			};
		},
		'getCss': function() {
			return {
			};
		},

		'onAction': function(vm, event) {
			this.selected(event.detail.index);
		}
	};

	return {
		'viewModel': MaterialListbox,
		'template': htmlString
	};
});
