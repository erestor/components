define(['text!./iron-collapse.html', '../tools/tools'], function(htmlString, tools) {

	var IronCollapse = function(params) {
		this.opened = params.opened;
		this.collapseId = tools.getGuid();
		this.openedSubscription = this.opened.subscribe(this._layout.bind(this));
	};
	IronCollapse.prototype = {
		'koDescendantsComplete': function() {
			this._layout();
		},
		'dispose': function() {
			this.openedSubscription.dispose();
		},
		'_layout': function() {
			const content = $(`#${this.collapseId}`)[0];
			if (!this.opened())
				content.style.maxHeight = null;
			else
				content.style.maxHeight = content.scrollHeight ? content.scrollHeight + 'px' : '100vh';
		}
	};

	return {
		'viewModel': IronCollapse,
		'template': htmlString
	};
});
