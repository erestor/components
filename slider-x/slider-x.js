define(['text!./slider-x.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function (params) {
		//the order of the attributes matter - especially the value must be after min and max
		this.dialogId = tools.getGuid();
		this.value = params.value;
		this.sliderAttrs = {
			'id': this.dialogId,
			'min': params.min || 0,
			'max': params.max || 100,
			'value': this.value,
			'pin': params.pin
		};
		if (params.secondaryProgress)
			this.sliderAttrs['secondary-progress'] = params.secondaryProgress;

		if (params.marked) {
			this.sliderAttrs.snaps = true;
			this.sliderAttrs.step = 1;
			this.sliderAttrs['max-markers'] = this.sliderAttrs.max;
		}

		this.enable = params.enable !== undefined ? params.enable : true;
	};
	ViewModel.prototype = {
		'onChanged': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.value);
		},
		'onImmediateChange': function() {
			var d = $('#' + this.dialogId)[0];
			this.value(d.immediateValue);
		}
	};

    return {
		'viewModel': ViewModel,
		'template': htmlString
	};
});
