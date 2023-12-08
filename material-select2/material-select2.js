define(['text!./material-select2.html', '../tools/tools', '@material/select'],
function(htmlString, tools, materialSelect) {

	const MaterialSelect = function(params) {
		this.label = params.label;
		this.filled = ko.unwrap(params.filled);
		this.required = ko.unwrap(params.required);

		this.selectedIndex = params.selectedIndex;
		this.value = params.value;

		if (!this.value && !this.selectedIndex)
			throw 'Must specify at least one of value and selectedIndex when creating a material-select';

		this.enable = tools.readEnableStatus(params);
		this.noLabel = ko.pureComputed(() => !ko.unwrap(params.label));

		//data binding
		this.labelId = tools.getGuid();
		this.selectedTextId = tools.getGuid();

		//component lifecycle
		this.mdcSelect = null;
		this.selectedIndexSubscription = null;
		this.valueSubscription = null;
	};
	MaterialSelect.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			this.mdcSelect = new materialSelect.MDCSelect($(node).find('.mdc-select')[0]);
			this.mdcSelect.menu.setFixedPosition(true);
			if (this.selectedIndex) {
				this.mdcSelect.setSelectedIndex(ko.unwrap(this.selectedIndex));
				this.selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					if (this.mdcSelect.selectedIndex != newVal)
						this.mdcSelect.setSelectedIndex(newVal);
				});
			}
			if (this.value) {
				this.mdcSelect.setValue(ko.unwrap(this.value));
				this.valueSubscription = this.value.subscribe(newVal => {
					if (this.mdcSelect.value != newVal)
						this.mdcSelect.setValue(newVal);
				});
			}
		},
		'dispose': function() {
			if (this.selectedIndexSubscription)
				this.selectedIndexSubscription.dispose();

			if (this.valueSubscription)
				this.valueSubscription.dispose();

			if (this.mdcSelect)
				this.mdcSelect.destroy();
		},

		'getCss': function() {
			return {
				'mdc-select--filled': this.filled,
				'mdc-select--outlined': !this.filled,
				'mdc-select--required': this.required,
				'mdc-select--disabled': !this.enable(),
				'mdc-select--no-label': this.noLabel
			};
		},
		'getAnchorAttrs': function() {
			return {
				'aria-labelledby': this.labelId + ' ' + this.selectedTextId,
				'aria-required': this.required,
				'aria-disabled': !this.enable()
			};
		},

		'onChanged': function(vm, event) {
			if (this.selectedIndex)
				this.selectedIndex(event.detail.index);

			if (this.value)
				this.value(event.detail.value);
		}
	};

	return {
		'viewModel': MaterialSelect,
		'template': htmlString
	};
});
