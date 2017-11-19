define(
	['text!./paper-select.html'],
	function(htmlString) {

	function ViewModel(params) {
		this.value = params.value;
		this.options = params.options;
		this.label = params.label;
		this.noLabelFloat = params.noLabelFloat;
		this.optionsValue = params.optionsValue;
		this.optionsText = params.optionsText;
		this.optionsCaption = params.optionsCaption;
		this.disable = params.disable !== undefined ? params.disable : false;

		var self = this;
		this.selectedItemIndex = ko.pureComputed(function() {
			var val = self.value(),
				opts = self.options ? ko.unwrap(self.options) : [];

			for (var i = 0; i < opts.length; ++i) {
				if (self.getOptionValue(opts[i]) == val)
					return i;
			}
			return -1;
		});
		this.selectedItemMenuIndex = ko.pureComputed(function() {
			var index = self.selectedItemIndex();
			return self.optionsCaption ? index + 1 : index;
		});
	}
	ViewModel.prototype = {
		'onSelected': function(vm, ev) {
			var val = $(ev.target.selectedItem).attr('data-value');
			this.value(val);
		},
		'getOptionText': function(item) {
			switch (typeof this.optionsText) {
				case 'function': return this.optionsText(item);
				case 'string': return ko.unwrap(item[this.optionsText]);
				default: return item;
			}
		},
		'getOptionValue': function(item) {
			switch (typeof this.optionsValue) {
				case 'function': return this.optionsValue(item);
				case 'string': return ko.unwrap(item[this.optionsValue]);
				default: return item;
			}
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
