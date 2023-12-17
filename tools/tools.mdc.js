define([], function() {
	return {
		//converts numeric values to string and back to work nicely with mdc-select
		'makeMdcSelectAdaptorForNumber': function(observable) {
			return ko.computed({
				'read': () => ko.unwrap(observable) + '',
				'write': value => observable(parseFloat(value))
			});
		},

		//converts null values to -1 and back so that given nullable string observable
		//can be used as the selected value for material-select
		'makeMdcSelectAdaptorForNullableString': function(observable) {
			return ko.computed({
				'read': function() {
					const actual = observable();
					return actual === undefined || actual === null ? '-1' : actual;
				},
				'write': value => observable(value == '-1' ? null : value)
			});
		},

		//converts null values to -1 and back so that given nullable integral observable
		//can be used as the selected value for material-select
		'makeMdcSelectAdaptorForNullableInt': function(observable) {
			return ko.computed({
				'read': function() {
					const actual = observable();
					return actual === undefined || actual === null ? '-1' : (actual + '');
				},
				'write': value => observable(value == '-1' ? null : parseInt(value))
			});
		}
	};
});
