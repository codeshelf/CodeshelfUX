goog.provide('codeshelf.mainpage');
goog.require('codeshelf.templates');
goog.require('codeshelf.listview');
goog.require('goog.fx.Dragger');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('jquery.rotate');

//var codeshelflogo = $('#codeshelflogo');
//codeshelflogo.rotate(-90);

var resizer2;
var Z;
var theWindow;

codeshelf.mainpage.launch = function () {

	goog.dom.setProperties(goog.dom.getDocument().body, {class:'main_body'});
	goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.mainPage));

	Z = 5;
	var frameTop = 5;
	var frameLeft = 5;

	var limits = new goog.math.Rect(frameTop, frameLeft, 750, 600);

	var window1 = goog.dom.getElement('win1');
	var window2 = goog.dom.getElement('win2');
	var window3 = goog.dom.getElement('win3');
	var dragger1 = new goog.fx.Dragger(window1, goog.dom.query('#win1 .bar')[0], limits);
	var dragger2 = new goog.fx.Dragger(goog.dom.getElement('win2'), goog.dom.query('#win2 .bar')[0], limits);
	resizer2 = new goog.fx.Dragger(goog.dom.getElement('pager'), goog.dom.query('#pager')[0], limits);
	var dragger3 = new goog.fx.Dragger(goog.dom.getElement('win3'), goog.dom.query('#win3 .bar')[0], limits);

	theWindow = goog.dom.getElement('win2');

	dragger3.setHysteresis(6);

	goog.events.listen(dragger1, 'start', codeshelf.mainpage.createMoverStart(window1));
	goog.events.listen(dragger2, 'start', codeshelf.mainpage.createMoverStart(window2));
	goog.events.listen(resizer2, 'start', codeshelf.mainpage.createMoverStart(window2));
	goog.events.listen(dragger3, 'start', codeshelf.mainpage.createMoverStart(window3));

	goog.events.listen(dragger1, 'end', codeshelf.mainpage.createMoverEnd(window1));
	goog.events.listen(dragger2, 'end', codeshelf.mainpage.createMoverEnd(window2));
	goog.events.listen(resizer2, 'end', codeshelf.mainpage.createMoverEnd(window2));
	goog.events.listen(dragger3, 'end', codeshelf.mainpage.createMoverEnd(window3));

	goog.events.listen(window, 'unload', function (e) {
		dragger1.dispose();
		dragger2.dispose();
		resizer2.dispose();
		dragger3.dispose();
	});

	var frame = goog.dom.query('#frame')[0];
	frame.style.top = frameTop + 5 + 'px';
	frame.style.left = frameLeft + 'px';

	codeshelf.mainpage.updateFrameSize(goog.dom.getViewportSize());

// Start listening for viewport size changes.
	var vsm = new goog.dom.ViewportSizeMonitor();
	goog.events.listen(vsm, goog.events.EventType.RESIZE, function (e) {
		size = vsm.getSize();
		size.height -= 10;
		codeshelf.mainpage.updateFrameSize(size);
	});

	launchListView();
}

codeshelf.mainpage.createMoverStart = function (mover) {
	var moverFunc = function moveWindowSetZ(e) {
		mover.style.zIndex = Z++;
		goog.style.setOpacity(mover, 0.50);
	};
	return moverFunc;
}

codeshelf.mainpage.createMoverEnd = function (mover) {
	var moverFunc = function moveWindowEnd(e) {
		goog.style.setOpacity(mover, 1);
	}
	return moverFunc;
}

codeshelf.mainpage.updateFrameSize = function (size) {
	// goog.style.setSize(goog.dom.getElement('frame'), size);
	frame.style.width = size.width - 15 + 'px';
	frame.style.height = size.height - 5 + 'px';
}

//codeshelf.mainpage.launch();
