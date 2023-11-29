define(['text!./material-list-item.html', '../tools/tools'],
function(htmlString, tools) {

	const MaterialListItem = function(params) {
		this.click = params.click;
		this.text = params.text;
		this.enable = tools.readEnableStatus(params);
	};
	MaterialListItem.prototype = {
		'getCss': function() {
			return {
				'mdc-deprecated-list-item--disabled': !this.enable()
			};
		}
	};

	return {
		'viewModel': MaterialListItem,
		'template': htmlString
	};
});
