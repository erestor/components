define(['text!./material-listbox.html', '../material-list/material-list'],
function(htmlString, materialListComponent) {

	const base = materialListComponent.viewModel;

	const MaterialListbox = function(params) {
		base.call(this, params);
		this.selected = params.selected;

		//component lifetime
		this.selectedSubscription = null;
	};
	MaterialListbox.prototype = Object.create(base.prototype);
	MaterialListbox.prototype.constructor = MaterialListbox;

	MaterialListbox.prototype.koDescendantsComplete = function(node) {
		base.prototype.koDescendantsComplete.call(this, node);
		this.mdcList.singleSelection = true;
		this.mdcList.selectedIndex = ko.unwrap(this.selected);
		this.selectedSubscription = this.selected.subscribe(newVal => {
			this.mdcList.selectedIndex = newVal;
		});
	};
	MaterialListbox.prototype.dispose = function() {
		if (this.selectedSubscription)
			this.selectedSubscription.dispose();

		base.prototype.dispose.call(this);
	};

	MaterialListbox.prototype.onAction = function(vm, event) {
		this.selected(event.detail.index);
	};

	return {
		'viewModel': MaterialListbox,
		'template': htmlString
	};
});
