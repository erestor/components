define([],
function() {
	return {
		'getGuid': function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		'readEnableStatus': function(params) {
			if (params.enable !== undefined && params.disable !== undefined)
				throw 'Cannot specify both \'enable\' and \'disable\' parameters';

			if (params.disable !== undefined)
				return ko.computed(function() { return !ko.unwrap(params.disable); });
			else
				return params.enable !== undefined ? params.enable : true;
		}
	};
});
