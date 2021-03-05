define(['./animations'], function(animations) {

    ko.bindingHandlers.disable = {
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            ko.bindingHandlers.enable.update(element, function () {
				return !value;
			});
        }
    };

	//#region Keyboard

    ko.bindingHandlers.escape = {
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var command = valueAccessor();
			if (!command)
				return;

            $(element).off('keyup.escapeBindingHandler').on('keyup.escapeBindingHandler', function (event) {
                if (event.keyCode === 27) { // <ESC>
                    command.call(viewModel, viewModel, event);
                }
            });
        }
    };

	ko.bindingHandlers.enter = {
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var command = valueAccessor();
			if (!command)
				return;

            $(element).off('keyup.enterBindingHandler').on('keyup.enterBindingHandler', function (event) {
                if (event.keyCode === 13) { // <Enter>
                    command.call(viewModel, viewModel, event);
                }
            });
        }
	};

	//global keydown, not usable for single elements
	ko.bindingHandlers.keydown = {
		'init': function(element, valueAccessor) {
            var handler = valueAccessor();
			$(document).on('keydown', handler);

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$(document).off('keydown', handler);
			});
		}
	};

	//#endregion

	//#region Attributes

	ko.bindingHandlers.flex = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { flex: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.href = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { href: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.icon = {
		update: function (element, valueAccessor) {
			var val = valueAccessor();
			ko.bindingHandlers.attr.update(element, function () {
				return { icon: val, alt: val };
			});
		}
	};

	ko.bindingHandlers.id = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { id: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.label = {
		update: function (element, valueAccessor, allBindingsAccessor) {
			var val = valueAccessor();
			if (ko.unwrap(allBindingsAccessor().required))
				val += ' *';

			ko.bindingHandlers.attr.update(element, function() {
				return { label: val };
			});
		}
	};

	ko.bindingHandlers.placeholder = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { placeholder: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.src = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { src: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.title = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { title: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.raised = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { raised: valueAccessor() };
			});
		}
	};

	ko.bindingHandlers.active = {
		update: function (element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, function () {
				return { active: valueAccessor() };
			});
		}
	};

	//#endregion

	//#region Visibility

	ko.bindingHandlers.opaque = {
		update: function(element, valueAccessor) {
			var value = valueAccessor();
			$(element).css('visibility', ko.unwrap(value) ? 'visible' : 'hidden');
		}
	};

	ko.bindingHandlers.transparent = {
		update: function(element, valueAccessor) {
			var value = valueAccessor();
			$(element).css('visibility', !ko.unwrap(value) ? 'visible' : 'hidden');
		}
	};

	//#endregion

	//#region Animation

	ko.bindingHandlers.slideDown = {
		init: function(element, valueAccessor) {
			var value = valueAccessor();
			$(element).toggle(ko.unwrap(value));
		},
		update: function(element, valueAccessor) {
			var value = valueAccessor();
			if (ko.unwrap(value))
				$(element).slideDown(animations.$timing);
			else
				$(element).slideUp(animations.$timing);
		}
	};

	//#endregion

	//#region Deferred composition

	ko.bindingHandlers.when = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var needAsyncContext = allBindings.has(ko.bindingEvent.descendantsComplete),
				savedNodes,
				isRendered,
				resetSubscription;

			var subscription = ko.when(trigger, render),
				resetter = allBindings.get('resetOnChange');

			if (resetter) {
				var hasIgnoreResetClass = allBindings.has('ignoreResetClass'),
					ignoreResetClass = hasIgnoreResetClass && allBindings.get('ignoreResetClass');

				resetSubscription = resetter.subscribe(function() {
					if (!isRendered || (hasIgnoreResetClass && $(element).hasClass(ignoreResetClass))) {
						//not rendered or should not reset - nothing to do
						return;
					}
					ko.virtualElements.emptyNode(element);
					//ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete); ko.bindingEvent.notify seems to be undefined in KO release!
					isRendered = false;
					subscription = ko.when(trigger, render);
				});
			}

			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
		        subscription.dispose();
				if (resetSubscription)
					resetSubscription.dispose();
	        });

            return {
				'controlsDescendantBindings': true
			};

			function trigger() {
				return ko.unwrap(valueAccessor());
			}

			function render() {
				if (needAsyncContext)
					bindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

				if (!savedNodes)
					savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
				else
					ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));

				ko.applyBindingsToDescendants(bindingContext, element);
				isRendered = true;
			}
        }
	};
	ko.virtualElements.allowedBindings.when = true;

	ko.bindingHandlers.visibleDeferred = {
		'init': ko.bindingHandlers.when.init,
        'update': ko.bindingHandlers.visible.update
	};

	//#endregion
});
