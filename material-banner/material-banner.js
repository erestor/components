define(['text!./material-banner.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		this.icon = params.icon;
		this.text = params.text;
		this.buttons = params.buttons;
		this.closed = params.closed;
		this.id = tools.getGuid();

		var self = this;
		var onButtonClick = function(index) {
			var buttons = self.buttons;
			if (buttons[index].dismiss)
				self._hide();

			if (buttons[index].click)
				buttons[index].click();
		};

		this.onButton0 = function() {
			onButtonClick(0);
		};
		this.onButton1 = function() {
			onButtonClick(1);
		};
	};
	ViewModel.prototype = {
		'_hide': function() {
			var self = this;
			$('#' + this.id).parent().slideUp({
				duration: 375,
				easing: 'easeOutCubic',
				complete: function() {
					if (ko.isWritableObservable(self.closed))
						self.closed(true);
				}
			});
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
