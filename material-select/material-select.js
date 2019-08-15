define(
	['text!./material-select.html', '../tools/tools'],
	function(htmlString, tools) {

	function ViewModel(params) {
		this.alwaysNotify = params.alwaysNotify; //onSelected will trigger events and write value even if selection does not change
		this.afterChange = params.afterChange;
		this.beforeChange = params.beforeChange;
		this.enable = tools.readEnableStatus(params);
		this.label = params.label;
		this.options = params.options;
		this.optionsCaption = params.optionsCaption;
		this.optionsText = params.optionsText;
		this.optionsValue = params.optionsValue;
		this.title = params.title;
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
		this.selectedItem = ko.pureComputed(function() {
			var index = self.getItemIndex(self.value());
			return index >= 0 ? ko.unwrap(self.options)[index] : null;
		});
		this.selectedItemText = ko.pureComputed(function() {
			var index = self.getItemIndex(self.value()),
				item = index >= 0 ? ko.unwrap(self.options)[index] : null;

			return item ? self.getOptionText(item, index) : self.optionsCaption;
		});
		this.selectedItemMenuIndex = ko.pureComputed(function() {
			var index = self.getItemIndex(self.value()),
				paperIndex = index;

			if (self.optionsCaption)
				paperIndex++;

			if (self.title)
				paperIndex++;

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
				this.beforeChange(undefined, oldVal);

			this.value(undefined);
			if (this.afterChange)
				this.afterChange(undefined, oldVal);
		},
		'onSelected': function(item) {
			var oldVal = this.value(),
				newVal = this.getOptionValue(item);

			if (!this.alwaysNotify && oldVal === newVal)
				return;

			if (this.beforeChange)
				this.beforeChange(newVal, oldVal);

			this.value(newVal);
			if (this.afterChange)
				this.afterChange(newVal, oldVal);
		},
		'getItemIndex': function(value) {
			var opts = ko.unwrap(this.options) || [];
			for (var i = 0; i < opts.length; ++i) {
				if (this.getOptionValue(opts[i]) == value)
					return i;
			}
			return -1;
		},
		'getOptionText': function(item, index) {
			var text = item;
			switch (typeof this.optionsText) {
				case 'function':
					text = this.optionsText(item, index);
					break;

				case 'string':
					text = ko.unwrap(item[this.optionsText]);
					break;
			}
			if (item === this.selectedItem.peek()) {
				//if selected item's had been updated dynamically, the internal input of paper-menu-button doesn't update automatically,
				//so we must do it here
				var menu = $('#' + this.rootId);
				if (menu.length === 1) {
					var input = $(menu[0].$.menuButton).find('paper-input');
					input.val(text);
				}
			}
			return text;
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
