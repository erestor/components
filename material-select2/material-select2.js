define(['text!./material-select2.html', '../tools/tools', '@material/select'],
function(htmlString, tools, materialSelect) {

	const MaterialSelect = function(params) {
		this.label = params.label;
		this.filled = ko.unwrap(params.filled);
		this.required = ko.unwrap(params.required);

		this.selectedIndex = params.selectedIndex;
		this.select = params.select;

		if (params.value !== undefined) {
			if (params.allowNull) {
				this.value = ko.computed({
					//this is a little adaptor so that null values are converted to -1 and back to work nicely with mdc-select
					'read': function() {
						const actual = ko.unwrap(params.value);
						return actual === undefined || actual === null ? '-1' : (actual + '');
					},
					'write': value => params.value(value == '-1' ? null : value)
				});
				this.disposeValue = true;
			}
			else {
				const valueIsNumeric = typeof ko.unwrap(params.value) == 'number';
				if (!valueIsNumeric)
					this.value = params.value;
				else {
					this.value = ko.computed({
						//convert numeric values to string and back to work nicely with mdc-select
						'read': () => ko.unwrap(params.value) + '',
						'write': value => params.value(parseFloat(value))
					});
					this.disposeValue = true;
				}
			}
		}

		this.enable = tools.readEnableStatus(params);
		this.noLabel = ko.pureComputed(() => !ko.unwrap(params.label));

		this.layoutUpdater = ko.computed(() => {
			if (ko.isObservable(params.items))
				params.items(); //introduce dependency

			if (this.mdcSelect)
				setTimeout(() => ko.ignoreDependencies(() => this.mdcSelect.layoutOptions()));
		});

		//data binding
		this.labelId = tools.getGuid();
		this.selectedTextId = tools.getGuid();

		//component lifecycle
		this.mdcSelect = null;
		this.enableSubscription = null;
		this.selectedIndexSubscription = null;
		this.valueSubscription = null;
	};
	MaterialSelect.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			var el = $(node).find('.mdc-select');
			this.mdcSelect = new materialSelect.MDCSelect(el[0]);
			this.mdcSelect.menu.setFixedPosition(true);
			this.mdcSelect.disabled = !this.enable();
			this.enableSubscription = this.enable.subscribe(newVal => this.mdcSelect.disabled = !newVal);
			if (this.selectedIndex) {
				this.mdcSelect.selectedIndex = ko.unwrap(this.selectedIndex);
				this.selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					if (this.mdcSelect.selectedIndex != newVal)
						this.mdcSelect.selectedIndex = newVal;
				});
			}
			if (this.value) {
				this.mdcSelect.value = ko.unwrap(this.value);
				this.valueSubscription = this.value.subscribe(newVal => {
					if (this.mdcSelect.value != newVal)
						this.mdcSelect.value = newVal;
				});
			}
			el.data('mdc-select', this.mdcSelect);
		},
		'dispose': function() {
			if (this.disposeValue)
				this.value.dispose();

			this.layoutUpdater.dispose();

			if (this.enableSubscription)
				this.enableSubscription.dispose();

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
				'mdc-select--no-label': this.noLabel
			};
		},
		'getAnchorAttrs': function() {
			return {
				'aria-labelledby': this.labelId + ' ' + this.selectedTextId,
				'aria-required': this.required
			};
		},

		'onChanged': function(vm, event) {
			//the changes to the observables could lead to menu items changing, so must wait till mdc processing is done
			setTimeout(() => {
				if (this.selectedIndex)
					this.selectedIndex(event.detail.index);

				if (this.value)
					this.value(event.detail.value);

				if (this.select)
					this.select(event.detail.value, event.detail.index);
			});
		}
	};

	return {
		'viewModel': MaterialSelect,
		'template': htmlString
	};
});
