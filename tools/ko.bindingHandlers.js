define(['./animations'], function(animations) {

	const trimString = function(value) {
		return value === null || value === undefined ? '' : value.trim();
	};

	ko.bindingHandlers.disable = {
		'update': function(element, valueAccessor) {
			const value = ko.unwrap(valueAccessor());
			ko.bindingHandlers.enable.update(element, () => !value);
		}
	};

	//#region Keyboard

	ko.bindingHandlers.escape = {
		'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
			const eventName = 'keyup.escapeBindingHandler',
				command = valueAccessor();

			$(element).on(eventName, handler);
			ko.utils.domNodeDisposal.addDisposeCallback(element, () => $(element).off(eventName, handler));

			function handler(event) {
				if (event.keyCode === 27) // <ESC>
					command.call(viewModel, viewModel, event);
			}
		}
	};

	ko.bindingHandlers.enter = {
		'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
			const eventName = 'keyup.enterBindingHandler',
				command = valueAccessor();

			$(element).on(eventName, handler);
			ko.utils.domNodeDisposal.addDisposeCallback(element, () => $(element).off(eventName, handler));

			function handler(event) {
				if (event.keyCode === 13) // <Enter>
					command.call(viewModel, viewModel, event);
			}
		}
	};

	//global keydown, not usable for single elements
	ko.bindingHandlers.keydown = {
		'init': function(element, valueAccessor) {
			const eventName = 'keydown.keydownBindingHandler',
				command = valueAccessor();

			$(document).on(eventName, command);
			ko.utils.domNodeDisposal.addDisposeCallback(element, () => $(document).off(eventName, command));
		}
	};

	//#endregion

	//#region Attributes

	ko.bindingHandlers.href = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ href: valueAccessor() }));
		}
	};

	ko.bindingHandlers.id = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ id: valueAccessor() }));
		}
	};

	ko.bindingHandlers.label = {
		'update': function(element, valueAccessor, allBindingsAccessor) {
			var val = valueAccessor();
			if (ko.unwrap(allBindingsAccessor().required))
				val += ' *';

			ko.bindingHandlers.attr.update(element, () => ({ label: val }));
		}
	};

	ko.bindingHandlers.placeholder = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ placeholder: valueAccessor() }));
		}
	};

	ko.bindingHandlers.src = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ src: valueAccessor() }));
		}
	};

	ko.bindingHandlers.title = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ title: valueAccessor() }));
		}
	};

	ko.bindingHandlers.active = {
		'update': function(element, valueAccessor) {
			ko.bindingHandlers.attr.update(element, () => ({ active: valueAccessor() }));
		}
	};

	//#endregion

	//#region Visibility

	ko.bindingHandlers.opaque = {
		'update': function(element, valueAccessor) {
			const value = ko.unwrap(valueAccessor());
			$(element).css('visibility', value ? 'visible' : 'hidden');
		}
	};

	ko.bindingHandlers.transparent = {
		'update': function(element, valueAccessor) {
			const value = ko.unwrap(valueAccessor());
			$(element).css('visibility', value ? 'hidden' : 'visible');
		}
	};

	//#endregion

	//#region Knockout overrides

	//takes advantage of native element.classList property
	ko.bindingHandlers.css = {
		'update': function(element, valueAccessor) {
			var value = ko.unwrap(valueAccessor());
			if (value === null || typeof value != "object")
				ko.bindingHandlers['class'].update(element, valueAccessor);
			else {
				ko.utils.objectForEach(value, (className, shouldHaveClass) => {
					element.classList.toggle(className, !!ko.unwrap(shouldHaveClass));
				});
			}
		}
	};

	//takes advantage of native element.classList property
	ko.bindingHandlers['class'] = function() {
		var classesWrittenByBindingKey = '__ko__cssValue';
		return {
			'update': function(element, valueAccessor) {
				if (element[classesWrittenByBindingKey] !== undefined)
					element.classList.remove(element[classesWrittenByBindingKey]);

				const value = trimString(ko.unwrap(valueAccessor()));
				if (value.length > 0) {
					element.classList.add(value);
					element[classesWrittenByBindingKey] = value;
				}
			}
		};

	}();

	//#endregion

	//#region Animation

	ko.bindingHandlers.slideDown = {
		init: function(element, valueAccessor) {
			var value = valueAccessor();
			$(element).toggle(ko.unwrap(value));
		},
		'update': function(element, valueAccessor) {
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
			const needAsyncContext = allBindings.has(ko.bindingEvent.descendantsComplete),
				resetter = allBindings.get('resetOnChange');
				//completeOnRender = allBindings.get("completeOn") == "render";

			var renderSubscription = ko.when(trigger, render),
				savedNodes,
				isRendered,
				resetSubscription;

			if (resetter) {
				const hasIgnoreResetClass = allBindings.has('ignoreResetClass'),
					ignoreResetClass = hasIgnoreResetClass && allBindings.get('ignoreResetClass');

				resetSubscription = resetter.subscribe(function() {
					if (!isRendered || (hasIgnoreResetClass && $(element).hasClass(ignoreResetClass))) {
						//not rendered or should not reset - nothing to do
						return;
					}
					ko.virtualElements.emptyNode(element);
					ko.applyBindingsToDescendants(bindingContext, element);
					//ko.bindingEvent.notify doesn't exist in release so the applyBindingsToDescendants is used instead
					//ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete);
					isRendered = false;
					renderSubscription = ko.when(trigger, render);
				});
			}

			ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
				resetSubscription?.dispose();
				renderSubscription.dispose();
			});

            //if (!completeOnRender)
				//ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete); //ko.bindingEvent.notify doesn't exist in release

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
