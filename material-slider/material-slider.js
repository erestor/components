define(['text!./material-slider.html', '../tools/tools'],
function(htmlString, tools) {

	var ViewModel = function(params) {
		//the order of the attributes matter - especially the value must be after min and max
		this.dialogId = tools.getGuid();
		this.value = params.value;
		this.enable = tools.readEnableStatus(params);
		this.sliderAttrs = {
			'id': this.dialogId,
			'min': params.min || 0,
			'max': params.max || 100,
			'value': this.value,
			'pin': params.pin,
			'expand': params.expand
		};

		var self = this;
		if (params.secondaryProgress)
			this.sliderAttrs['secondary-progress'] = params.secondaryProgress;

		if (params.step) {
			this.sliderAttrs.snaps = true;
			this.sliderAttrs.step = params.step;
		}
		if (params.marked) {
			this.sliderAttrs.snaps = true;
			this.sliderAttrs.step = 1;
			this.sliderAttrs['max-markers'] = this.sliderAttrs.max;
		}
		this.label = !params.label ? null : ko.pureComputed(function() {
			var txt = ko.unwrap(params.label);
			var value = ko.unwrap(self.value);
			var valueDesc = typeof params.valueDesc == 'function' ? params.valueDesc(value) : value;
			txt += ' (' + valueDesc + ')';
			return txt;
		});
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
