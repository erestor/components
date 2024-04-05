define(['text!./material-collapse.html'], function(htmlString) {

	var MaterialCollapse = function(params) {
		this.opened = params.opened;
		this.node = null;
		this.content = null;
		this._openedSubscription = null;
		this._resizeObserver = null;
	};
	MaterialCollapse.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.node = node;
			this.content = $(node).find('> .material-collapse__content')[0];
			this._resizeObserver = new window.ResizeObserver(entries => {
				for (const entry of entries) {
					const height = entry.borderBoxSize[0].blockSize;
					this._setMaxHeight(height);
				}
			});

			this._layout();
			this._openedSubscription = this.opened.subscribe(this._layout.bind(this));
		},
		'dispose': function() {
			this._openedSubscription?.dispose();
			this._resizeObserver?.disconnect();
		},

		'_layout': function() {
			if (this.opened())
				this._resizeObserver.observe(this.content);
			else {
				this._resizeObserver.unobserve(this.content);
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
