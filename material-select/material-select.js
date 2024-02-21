define(['text!./material-select.html', '../tools/tools', '../tools/tools.mdc', '@material/select'],
function(htmlString, tools, mdcTools, materialSelect) {

	const MaterialSelect = function(params) {
		this.label = params.label;
		this.selectedIndex = params.selectedIndex;
		this.select = params.select;
		this.valueIsNumeric = params.numeric;
		this.value = !this.valueIsNumeric ? params.value : mdcTools.makeMdcSelectAdaptorForNumber(params.value);
		this.validate = params.validationValue !== undefined;
		this.validationValue = params.validationValue;
		
		this.enable = tools.readEnableStatus(params);
		this.noLabel = ko.pureComputed(() => !ko.unwrap(params.label));
		this.filled = ko.unwrap(params.filled);
		this.required = ko.unwrap(params.required);

		this.layoutUpdater = ko.computed(() => {
			if (ko.isObservable(params.items))
				params.items(); //introduce dependency

			if (this.mdcSelect) {
				setTimeout(() => {
					ko.ignoreDependencies(() => this.mdcSelect.layoutOptions());
				});
			}
		});

		//data binding
		this.labelId = tools.getGuid();
		this.selectedTextId = tools.getGuid();
		if (this.validate)
			this.helperTextId = tools.getGuid();

		//component lifecycle
		this.mdcSelect = null;
		this._enableSubscription = null;
		this._selectedIndexSubscription = null;
		this._validationSubscription = null;
		this._valueSubscription = null;
	};
	MaterialSelect.prototype = {
		'koDescendantsComplete': function(node) {
			if (!node.isConnected)
				return;

			var el = node.querySelector('.mdc-select');
			this.mdcSelect = new materialSelect.MDCSelect(el);
			mdcTools.setMdcComponent(el, this.mdcSelect);

			this.mdcSelect.menu.setFixedPosition(true);
			this.mdcSelect.disabled = !this.enable();
			this.mdcSelect.required = !!this.required;
			this._enableSubscription = this.enable.subscribe(newVal => this.mdcSelect.disabled = !newVal);
			if (this.selectedIndex) {
				this.mdcSelect.selectedIndex = this.selectedIndex();
				this._selectedIndexSubscription = this.selectedIndex.subscribe(newVal => {
					setTimeout(() => {
						if (this.mdcSelect.selectedIndex != newVal)
							this.mdcSelect.selectedIndex = newVal;
					});
				});
			}
			if (this.value) {
				this.mdcSelect.value = this.value();
				this._valueSubscription = this.value.subscribe(newVal => {
					setTimeout(() => {
						if (this.mdcSelect.value != newVal)
							this.mdcSelect.value = newVal;
					});
				});
			}
			if (this.validate) {
				this.mdcSelect.valid = this.validationValue.isValid();
				this._validationSubscription = this.validationValue.isValid.subscribe(newVal => this.mdcSelect.valid = newVal);
			}

			//menu must be on top level to ensure proper function
			document.body.appendChild(this.mdcSelect.menu.root);
		},
		'dispose': function() {
			this.layoutUpdater.dispose();
			this._validationSubscription?.dispose();
			this._selectedIndexSubscription?.dispose();
			this._valueSubscription?.dispose();
			this._enableSubscription?.dispose();
			if (this.mdcSelect) {
				const el = this.mdcSelect.menu.root;
				this.mdcSelect.destroy();
				ko.removeNode(el);
			}
			if (this.valueIsNumeric)
				this.value.dispose();
		},

		'getCss': function() {
			return {
				'mdc-select--filled': this.filled,
				'mdc-select--outlined': !this.filled,
				'mdc-select--no-label': this.noLabel
			};
		},
		'getAnchorAttrs': function() {
			return {
				'aria-controls': this.validate ? this.helperTextId : undefined,
				'aria-describedby': this.validate ? this.helperTextId : undefined,
				'aria-labelledby': this.labelId + ' ' + this.selectedTextId
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
