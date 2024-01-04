define(['text!./material-top-app-bar.html', '@material/top-app-bar'],
function(htmlString, materialTopAppBar) {

	const MaterialTopAppBar = function(params) {
		this.fixed = params.fixed;
		this.prominent = params.prominent;

		//component lifetime
		this.mdcTopAppBar = null;
	};
	MaterialTopAppBar.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this._init(node);
		},
		'dispose': function() {
			if (this.mdcAppBar)
				this.mdcAppBar.destroy();
		},
		'getCss': function() {
			return {
				'mdc-top-app-bar--fixed': ko.unwrap(this.fixed),
				'mdc-top-app-bar--prominent': ko.unwrap(this.prominent)
			};
		},

		'_init': function(node) {
			const el = $(node).find('.mdc-top-app-bar'),
				sections = el.find('.mdc-top-app-bar__row > section');

			if (sections.find('.mdc-top-app-bar__title').length === 0) {
				//Must wait for the sections to be rendered. Otherwise the menu icon will not work.
				//This is a pitiful hack.
				setTimeout(() => this._init(node));
				return;
			}
			sections.addClass('mdc-top-app-bar__section');
			this.mdcAppBar = new materialTopAppBar.MDCTopAppBar(el[0]);
			this.mdcAppBar.setScrollTarget($('.main-content')[0]);
			this.mdcAppBar.listen('MDCTopAppBar:nav', () => {
				const drawerEl = $('.mdc-drawer'),
					mdcDrawer = drawerEl.data('mdc-drawer');

				mdcDrawer.open = !mdcDrawer.open;
			});
		}
	};

	return {
		'viewModel': MaterialTopAppBar,
		'template': htmlString
	};
});
