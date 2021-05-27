define([
	'text!./material-select.html',
	'../tools/tools'
],
function(htmlString, tools) {

	function MaterialSelect(params) {
		this.alwaysNotify = params.alwaysNotify; //trigger events and write value even if selection does not change
		this.afterChange = params.afterChange;
		this.beforeChange = params.beforeChange;
		this.enable = tools.readEnableStatus(params);
		this.fitInto = params.fitInto;
		this.label = params.label;
		this.options = params.options;
		this.optionsCaption = params.optionsCaption;
		this.optionsText = params.optionsText;
		this.optionsValue = params.optionsValue;
		this.title = params.title;
		this.value = params.value;

		this.rootId = tools.getGuid();
		this.dropdownAttrs = {
			'id': this.rootId,
			'horizontal-align': params.halign,
			'no-label-float': params.noLabelFloat,
			'vertical-align': params.valign
		};

		this._internallyChangingValue = false;
		var self = this;
		this.selectedIndex = ko.pureComputed(function() {
			var index = self._getSelectedValueMenuIndex();
			return index;
		});
		this.selectedItemText = ko.pureComputed(function() {
			var index = self._getSelectedItemIndex(),
				item = index >= 0 ? self._getUnwrappedOptions()[index] : null;

			return item ? self.getOptionText(item, index) : ko.unwrap(self.optionsCaption);
		});
	}
	MaterialSelect.prototype = {
		//this function is meant as virtual when material-select is used as base for other selection elements, such as material-menu-button
		'getDropdown': function() {
			if (!this.dropdownEl)
				this.dropdownEl = $('#' + this.rootId)[0].$.menuButton.$.dropdown;

			return this.dropdownEl;
		},

		'openedChanged': function() {
			if (!this.dropdownInited) {
				this.dropdownInited = true;
				var dropdown = this.getDropdown(),
					containerEl = $(this.fitInto);

				if (containerEl.length == 1)
					dropdown.fitInto = containerEl[0];

				dropdown.style.margin = '4px';
			}
		},

		'selectedChanged': function(vm, event) {
			if (this._internallyChangingValue)
				return;

			if (!this._getUnwrappedOptions().length) {
				//There are no options, therefore the selection is an invalid operation.
				//This happens when clearing the viewmodel collections providing options for dropdowns.
				//Ignore this.
				return;
			}
			var selIndex = this._convertToItemIndex(event.detail.value);
			if (selIndex >= 0)
				this._onItemSelected(this._getUnwrappedOptions()[selIndex]);
			else
				this._onCaptionSelected();
		},

		'getOptionText': function(item, index) {
			var text = this._getOptionText(item, index);
			if (item === this._getSelectedItem()) {
				//if selected item's value had been updated dynamically, the internal input of paper-dropdown-menu(-light) doesn't update automatically,
				//so we must do it here
				this._updateSelectedItemText(text);
			}
			return text;
		},

		'_getUnwrappedOptions': function() {
			return ko.unwrap(this.options);
		},
		'_getSelectedValueMenuIndex': function() {
			var index = this._getItemIndexFromValue(this.value());
			return this._convertToMenuIndex(index);
		},
		'_getSelectedItemIndex': function() {
			var paperIndex = this.selectedIndex();
			return this._convertToItemIndex(paperIndex);
		},
		'_getItemIndexFromValue': function(value) {
			var opts = this._getUnwrappedOptions() || [];
			for (var i = 0; i < opts.length; ++i) {
				if (this._getOptionValue(opts[i]) == value)
					return i;
			}
			return -1;
		},
		'_getSelectedItem': function() {
			var index = this._getSelectedItemIndex();
			return index >= 0 ? this._getUnwrappedOptions()[index] : null;
		},

		'_onItemSelected': function(item) {
			var oldVal = this.value(),
				newVal = this._getOptionValue(item);

			if (!this.alwaysNotify && oldVal === newVal)
				return;

			this._changeValue(newVal, oldVal);
		},
		'_onCaptionSelected': function() {
			var oldVal = this.value();
			if (oldVal === undefined || oldVal === null)
				return;

			this._changeValue(undefined, oldVal);
		},
		'_changeValue': function(newVal, oldVal) {
			if (this.beforeChange)
				this.beforeChange(newVal, oldVal);

			var skipUpdate = this.alwaysNotify && this.value.equalityComparer && this.value.equalityComparer(newVal, oldVal);
				//This select is configured to always notify, but the observable is not (has an equality comparer) and the values are equal,
				//so if we 'update' the observable nothing will happen.
				//Therefore we can skip it

			if (!skipUpdate) {
				this._internallyChangingValue = true;
				var self = this;
				var sub = this.value.subscribe(function() {
					self._internallyChangingValue = false;
					sub.dispose();
				});
				this.value(newVal);
			}
			if (this.afterChange)
				this.afterChange(newVal, oldVal);
		},

		'_getOptionValue': function(item) {
			switch (typeof this.optionsValue) {
				case 'function': return this.optionsValue(item);
				case 'string': return ko.unwrap(item[this.optionsValue]);
				default: return item;
			}
		},
		'_getOptionText': function(item, index) {
			switch (typeof this.optionsText) {
				case 'function': return this.optionsText(item, index);
				case 'string': return ko.unwrap(item[this.optionsText]);
				default: return item;
			}
		},

		'_convertToMenuIndex': function(index) {
			if (this.optionsCaption)
				index++;

			if (this.title)
				index++;

			return index;
		},
		'_convertToItemIndex': function(menuIndex) {
			if (this.optionsCaption)
				menuIndex--;

			if (this.title)
				menuIndex--;

			return menuIndex;
		},

		'_updateSelectedItemText': function(text) {
			var menu = $('#' + this.rootId);
			if (menu.length === 1) {
				if (menu.is('paper-dropdown-menu')) {
					var input = $(menu[0].$.menuButton).find('paper-input');
					input.val(text);
				}
				else if (menu.is('paper-dropdown-menu-light')) {
					var textfield = $(menu[0].$.input);
					textfield.text(text);
				}
				else {
					//different element (e.g. paper-menu-button) used in the template, do nothing
				}
			}
		}
	};

    return {
		'viewModel': MaterialSelect,
		'template': htmlString
	};
});
