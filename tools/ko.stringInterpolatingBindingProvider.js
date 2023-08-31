/*
	String interpolating binding provider by Steve Sanderson (adapted)

	Allows {{ expr }} syntax in DOM. Could be an official KO plugin
	loaded from a separate file. Note that preprocessNode is a fairly
	low-level API that developers are not often expected to use directly.
	https://jsfiddle.net/dC3Ge/1/
*/

var StringInterpolatingBindingProvider = function() {
	ko.bindingProvider.instance.constructor.call(this);
	this.constructor = StringInterpolatingBindingProvider;

	var expressionRegex = /{{([\s\S]+?)}}/g;

	this.preprocessNode = function(node) {
		if (!node.nodeValue || node.nodeType !== 3)
			return;

		//preprocess by replacing {{ expr }} with ko text nodes
		var newNodes = replaceExpressionsInText(node.nodeValue);

		if (newNodes) {
			//insert the resulting nodes into the DOM and remove the original unpreprocessed node
			for (var i = 0; i < newNodes.length; i++)
				node.parentNode.insertBefore(newNodes[i], node);

			node.parentNode.removeChild(node);
		}
		return newNodes;

		function replaceExpressionsInText(text) {
			var prevIndex = expressionRegex.lastIndex = 0,
				resultNodes = null,
				match;

			// Find each expression marker, and for each one, invoke the callback
			// to get an array of nodes that should replace that part of the text
			while ((match = expressionRegex.exec(text))) {
				var leadingText = text.substring(prevIndex, match.index);
				prevIndex = expressionRegex.lastIndex;
				resultNodes = resultNodes || [];

				// Preserve leading text
				if (leadingText)
					resultNodes.push(document.createTextNode(leadingText));

				resultNodes.push.apply(resultNodes, insertText(match[1]));
			}

			if (resultNodes) {
				// Preserve trailing text
				var trailingText = text.substring(prevIndex);
				if (trailingText)
					resultNodes.push(document.createTextNode(trailingText));
			}
			return resultNodes;
		}

		function insertText(expressionText) {
			return [
				document.createComment("ko text:" + expressionText),
				document.createComment("/ko")
			];
		}
	};
};

//inherit from original provider
StringInterpolatingBindingProvider.prototype = ko.bindingProvider.instance;

//register this provider
ko.bindingProvider.instance = new StringInterpolatingBindingProvider();
