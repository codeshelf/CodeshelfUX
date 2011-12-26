goog.provide('closureexample.foo.Bar');
goog.require('goog.dom');
/**
 * @constructor
 */
closureexample.foo.Bar = function(parent) {
	this.parent = parent;
}

closureexample.foo.Bar.prototype.showContent = function() {
	var element = goog.dom.createDom('div', {
		'style' : 'background:#FFFF00'
	}, "This was created in the Bar class");
	goog.dom.appendChild(this.parent, element);
}