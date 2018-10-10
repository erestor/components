define(
	['text!./material-select.html', '../tools/tools'],
	function(htmlString, tools) {

	function ViewModel(params) {
		this.alwaysNotify = params.alwaysNotify; //onSelected will trigger events and write value even if selection does not change
		this.afterChange = params.afterChange;
		this.beforeChange = params.beforeChange;
		this.enable = tools.readEnableStatus(params);
		this.label = params.label;
		this.noselect = params.noselect;
		this.options = params.options;
		this.optionsCaption = params.optionsCaption;
		this.optionsText = params.optionsText;
		this.optionsValue = params.optionsValue;
		this.value = params.value;

		this.rootId = tools.getGuid();
		this.listboxId = tools.getGuid();
		this.dropdownAttrs = {
			'id': this.rootId,
			'horizontal-align': params.halign,
			'no-label-float': params.noLabelFloat,
			'vertical-align': params.valign
		};

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
			var oldVal = this.value();
			if (oldVal === undefined || oldVal === null)
				return;

			if (this.beforeChange)
				this.beforeChange(oldVal);

			this.value(undefined);
			if (this.afterChange)
				this.afterChange(oldVal);
		},
		'onSelected': function(item) {
			var oldVal = this.value(),
				newVal = this.getOptionValue(item);

			if (!this.alwaysNotify && oldVal === newVal)
				return;

			if (this.beforeChange)
				this.beforeChange(oldVal, newVal);

			this.value(newVal);
			if (this.afterChange)
				this.afterChange(oldVal, newVal);
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
