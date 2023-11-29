define(['text!./material-list-icon-item.html', '../material-list-item/material-list-item'],
function(htmlString, materialListItem) {

	const base = materialListItem.viewModel;

	const MaterialListIconItem = function(params) {
		base.call(this, params);
		this.icon = params.icon;
	};
	MaterialListIconItem.prototype = Object.create(base.prototype);
	MaterialListIconItem.prototype.constructor = MaterialListIconItem;

	return {
		'viewModel': MaterialListIconItem,
		'template': htmlString
	};
});
