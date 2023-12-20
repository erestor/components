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
			else {
				if (!content.scrollHeight)
					content.style.maxHeight = '100vh';
				else {
					this._setMaxHeight(content);
					setTimeout(() => this._setMaxHeight(content), 100); //fixes dynamic content
				}
			}
		},
		'_setMaxHeight': function(content) {
			if (content.style && content.scrollHeight && this.opened())
				content.style.maxHeight = content.scrollHeight + 'px';
		}
	};

	return {
		'viewModel': IronCollapse,
		'template': htmlString
	};
});
