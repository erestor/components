define(['text!./text-input.html'],
function(htmlString) {

	var nextId = 0;

	var ViewModel = function(params) {
		this.value = params.value;
		this.label = params.label;
		this.title = params.title;
		this.hasFocus = params.hasFocus;
		this.enter = params.enter;
		this.placeholder = params.placeholder;
		this.name = params.name;
		this.disable = params.disable;
		this.id = 'common-components-text-input-' + nextId++;

		if (params.numeric) {
			//keep numeric values non-empty
			var self = this;
			this.subscription = this.value.subscribe(function(newVal) {
				if (isEmpty(newVal)) {
					setTimeout(function() {
						self.value('0');
						$('#' + self.id).focus();
					});
				}
			});
		}
	};
	ViewModel.prototype = {
		'dispose': function() {
			if (this.subscription)
				this.subscription.dispose();
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};

	function isEmpty(str) {
		return (str === undefined || str === null || str.length === 0);
	}
});
