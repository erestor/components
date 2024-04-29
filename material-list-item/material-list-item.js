define(['text!./material-list-item.html', '@skolaris/knockout-tools'],
function(htmlString, tools) {

	const MaterialListItem = function(params) {
		this.icon = params.icon;
		this.text = params.text;
		this.value = params.value;
		this.enable = tools.isComponentEnabled(params);

		this.click = typeof params.click != 'function' ? params.click : function(vm, event) {
			//the timeout means the parent list's selection handler will execute
			//even if the clicked item gets disabled as a result of click processing
			setTimeout(() => params.click(vm, event));
		};
	};
	MaterialListItem.prototype = {
		'getCss': function() {
			return {
				'mdc-deprecated-list-item--disabled': !this.enable()
			};
		},
		'getAttrs': function() {
			return {
				'data-value': this.value
			};
		}
	};

	return {
		'viewModel': MaterialListItem,
		'template': htmlString
	};
});
