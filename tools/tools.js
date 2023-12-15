define([], function() {
	return {
		'getGuid': function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},

		'readEnableStatus': function(params) {
			if (params.enable !== undefined && params.disable !== undefined)
				throw 'Cannot specify both \'enable\' and \'disable\' parameters';

			if (params.disable !== undefined)
				return ko.pureComputed(() => !ko.unwrap(params.disable));

			return params.enable === undefined ?
				ko.pureComputed(() => true) :
				ko.isComputed(params.enable) ? params.enable : ko.pureComputed(() => ko.unwrap(params.enable));
		},

		'trimString': function(value) {
            return value === null || value === undefined ? '' : value.trim();
        }
	};
});
