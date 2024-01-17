define(['text!./material-collapse.html'], function(htmlString) {

	var MaterialCollapse = function(params) {
		this.opened = params.opened;
		this.node = null;
		this.content = null;
		this.openedSubscription = null;
		this.resizeObserver = null;
	};
	MaterialCollapse.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.node = node;
			this.content = $(node).find('> .material-collapse__content')[0];
			this.resizeObserver = new window.ResizeObserver(entries => {
				for (const entry of entries) {
					const height = entry.borderBoxSize[0].blockSize;
					this._setMaxHeight(height);
				}
			});

			this._layout();
			this.openedSubscription = this.opened.subscribe(this._layout.bind(this));
		},
		'dispose': function() {
			this.openedSubscription.dispose();
			if (this.resizeObserver)
				this.resizeObserver.disconnect();
		},

		'_layout': function() {
			if (this.opened())
				this.resizeObserver.observe(this.content);
			else {
				this.resizeObserver.unobserve(this.content);
				this._setMaxHeight(null);
			}
		},
		'_setMaxHeight': function(height) {
			this.node.style.maxHeight = height === null ? height : (height + 'px');
		}
	};

	return {
		'viewModel': MaterialCollapse,
		'template': htmlString
	};
});
