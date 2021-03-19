define(['text!./material-menu-button.html', '../material-select/material-select'],
function(htmlString, materialSelectComponent) {

	var MaterialSelectVM = materialSelectComponent.viewModel;

	function ViewModel(params) {
		MaterialSelectVM.call(this, params);
		this.buttonCaption = params.buttonCaption;
		this.noselect = params.noselect;
		this.icon = params.icon || 'icons:arrow-drop-down';
		this.fitInto = params.fitInto;
	}
	ViewModel.prototype = Object.create(MaterialSelectVM.prototype);
	ViewModel.prototype.constructor = ViewModel;

	ViewModel.prototype.openedChanged = function() {
		if (!this.rootEl) {
			this.rootEl = $('#' + this.rootId);
			var m = this.rootEl[0],
				d = m.$.dropdown,
				containerEl = $(this.fitInto);

			if (containerEl.length == 1)
				d.fitInto = containerEl[0];

			d.style.margin = "4px";
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
