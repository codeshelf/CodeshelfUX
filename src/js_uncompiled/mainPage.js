goog.provide('codeshelf.mainpage');
goog.require('goog.fx.Dragger');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.dom.ViewportSizeMonitor');

var $ = goog.dom.getElement;

// WINDOW EXAMPLE
// ================

var Z = 5;

var limits = new goog.math.Rect(50, 50, 750, 600);

var window1 = $('win1');
var window2 = $('win2');
var window3 = $('win3');
var dragger1 = new goog.fx.Dragger(window1, goog.dom.query("#win1 .bar")[0], limits);
var dragger2 = new goog.fx.Dragger($('win2'), goog.dom.query("#win2 .bar")[0], limits);
var resizer2 = new goog.fx.Dragger($('pager'), goog.dom.query("#pager")[0], limits);
var dragger3 = new goog.fx.Dragger($('win3'), goog.dom.query("#win3 .bar")[0], limits);

var theWindow = $('win2');

dragger3.setHysteresis(6);

function createMoverStart(mover) {
	var moverFunc = function moveWindowSetZ(e) {
		mover.style.zIndex = Z++;
		goog.style.setOpacity(mover, 0.50);
	};
	return moverFunc;
}

function createMoverEnd(mover) {
	var moverFunc = function moveWindowEnd(e) {
		goog.style.setOpacity(mover, 1);
	}
	return moverFunc;
}

goog.events.listen(dragger1, 'start', createMoverStart(window1));
goog.events.listen(dragger2, 'start', createMoverStart(window2));
goog.events.listen(resizer2, 'start', createMoverStart(window2));
goog.events.listen(dragger3, 'start', createMoverStart(window3));

goog.events.listen(dragger1, 'end', createMoverEnd(window1));
goog.events.listen(dragger2, 'end', createMoverEnd(window2));
goog.events.listen(resizer2, 'end', createMoverEnd(window2));
goog.events.listen(dragger3, 'end', createMoverEnd(window3));

goog.events.listen(window, 'unload', function(e) {
	dragger1.dispose();
	dragger2.dispose();
	resizer2.dispose();
	dragger3.dispose();
});

var frame = $('frame');
frame.style.top = '20px';
frame.style.left = '20px';
function updateFrameSize(size) {
	// goog.style.setSize(goog.dom.getElement('frame'), size);
	frame.style.width = size.width - 40 + 'px';
	frame.style.height = size.height - 30 + 'px';
}
updateFrameSize(goog.dom.getViewportSize());

// Start listening for viewport size changes.
var vsm = new goog.dom.ViewportSizeMonitor();
goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
	size = vsm.getSize();
	size.height -= 10;
	updateFrameSize(size);
});
