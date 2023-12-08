define(['text!./material-list-item.html', '../tools/tools'],
function(htmlString, tools) {

	const MaterialListItem = function(params) {
		this.click = typeof params.click != 'function' ? params.click : function(vm, event) {
			//the timeout means the parent list's selection handler will execute
			//even if the clicked item gets disabled as a result of click processing
			setTimeout(() => params.click(vm, event));
		};
		this.text = params.text;
		this.value = params.value;
		this.enable = tools.readEnableStatus(params);
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
