goog.provide('closureexample.init');
goog.require('goog.dom');
goog.require('closureexample.foo.Bar');

closureexample.init = function(appTitle, parent) {
	var header = {
		'style' : 'background:#FF0000'
	};
	var content = "Application " + appTitle + " Starting"
	var element = goog.dom.createDom('div', header, content);
	goog.dom.appendChild(parent, element);

	var bar = new closureexample.foo.Bar(parent);
	bar.showContent();
};