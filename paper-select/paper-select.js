define(
	['text!./paper-select.html', '../tools/tools'],
	function(htmlString, tools) {

	function ViewModel(params) {
		this.enable = tools.readEnableStatus(params);
		this.halign = params.halign;
		this.label = params.label;
		this.noLabelFloat = params.noLabelFloat;
		this.noselect = params.noselect;
		this.options = params.options;
		this.optionsCaption = params.optionsCaption;
		this.optionsText = params.optionsText;
		this.optionsValue = params.optionsValue;
		this.valign = params.valign;
		this.value = params.value;

		this.listboxId = tools.getGuid();

		var self = this;
		this.selectedItemMenuIndex = ko.pureComputed(function() {
			var index = self.getItemIndex(self.value()),
				paperIndex = self.optionsCaption ? index + 1 : index;

			var listbox = $('#' + self.listboxId);
			if (listbox.length === 1)
				listbox[0].selected = paperIndex;

			return paperIndex;
		});
	}
	ViewModel.prototype = {
		'onCaptionSelected': function() {
			this.value(undefined);
		},
		'onSelected': function(option) {
			this.value(this.getOptionValue(option));
		},
		'getItemIndex': function(value) {
			var opts = ko.unwrap(this.options) || [];
			for (var i = 0; i < opts.length; ++i) {
				if (this.getOptionValue(opts[i]) == value)
					return i;
			}
			return -1;
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
