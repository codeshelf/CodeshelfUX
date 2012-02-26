goog.provide('codeshelf.mainpage');
goog.require('codeshelf.templates');
goog.require('codeshelf.listview');
goog.require('codeshelf.facilityeditor');
goog.require('codeshelf.window');
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

codeshelf.mainpage = function () {

	var application_;
	var websession_;
	var thisMainpage_;
	var frame_;
	var frameTop_ = 5;
	var frameLeft_ = 5;
	var limits_;

	return {

		enter:function (application, websession) {

			application_ = application;
			websession_ = websession;
			thisMainpage_ = this;

			websession_.setCurrentPage(this);

			goog.dom.setProperties(goog.dom.getDocument().body, {class:'main_body'});
			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.mainPage));

			z_ = 5;
			frame_ = goog.dom.query('#frame')[0];
			frame_.style.top = frameTop_ + 5 + 'px';
			frame_.style.left = frameLeft_ + 'px';

			limits_ = new goog.math.Rect(frameTop_, frameLeft_, 750, 600);

			//var window1 = goog.dom.getElement('win1');
			var window2 = goog.dom.getElement('win2');
//			var window3 = goog.dom.getElement('win3');

//			var dragger1 = new goog.fx.Dragger(window1, goog.dom.query('#win1 .bar')[0], limits_);
			var dragger2 = new goog.fx.Dragger(goog.dom.getElement('win2'), goog.dom.query('#win2 .bar')[0], limits_);
			var resizer2 = new goog.fx.Dragger(goog.dom.query('#win2 .pager')[0], goog.dom.query('#win2 .pager')[0], limits_);
//			var dragger3 = new goog.fx.Dragger(goog.dom.getElement('win3'), goog.dom.query('#win3 .bar')[0]);
//			var resizer3 = new goog.fx.Dragger(goog.dom.query('#win3 .pager')[0], goog.dom.query('#win3 .pager')[0]);

			resizer2.defaultAction = function (x, y) {
				leftDim = parseInt(window2.style.left, 10);
				topDim = parseInt(window2.style.top, 10);
				width = this.screenX - leftDim;
				height = y + 20 - topDim
				window2.style.width = width + 'px';
				window2.style.height = height + 'px';
				grid.resizeCanvas();
				grid.autosizeColumns();
			};

//			resizer3.defaultAction = function (x, y) {
//				leftDim = parseInt(window3.style.left, 10);
//				topDim = parseInt(window3.style.top, 10);
//				width = this.screenX - leftDim;
//				height = y + 20 - topDim
//				window3.style.width = width + 'px';
//				window3.style.height = height + 'px';
//				grid.resizeCanvas();
//				grid.autosizeColumns();
//			};

//			dragger3.setHysteresis(6);

//			goog.events.listen(dragger1, 'start', thisMainpage_.createMoverStart(window1));
			goog.events.listen(dragger2, 'start', thisMainpage_.createMoverStart(window2));
			goog.events.listen(resizer2, 'start', thisMainpage_.createMoverStart(window2));
//			goog.events.listen(dragger3, 'start', thisMainpage_.createMoverStart(window3));
//			goog.events.listen(resizer3, 'start', thisMainpage_.createMoverStart(window3));

//			goog.events.listen(dragger1, 'end', thisMainpage_.createMoverEnd(window1));
			goog.events.listen(dragger2, 'end', thisMainpage_.createMoverEnd(window2));
			goog.events.listen(resizer2, 'end', thisMainpage_.createMoverEnd(window2));
//			goog.events.listen(dragger3, 'end', thisMainpage_.createMoverEnd(window3));
//			goog.events.listen(resizer3, 'end', thisMainpage_.createMoverEnd(window3));

			goog.events.listen(window, 'unload', function (e) {
//				dragger1.dispose();
				dragger2.dispose();
				resizer2.dispose();
//				dragger3.dispose();
//				resizer3.dispose();
			});

			this.updateFrameSize(goog.dom.getViewportSize());

			// Start listening for viewport size changes.
			var vsm = new goog.dom.ViewportSizeMonitor();
			goog.events.listen(vsm, goog.events.EventType.RESIZE, function (e) {
				size = vsm.getSize();
				size.height -= 10;
				thisMainpage_.updateFrameSize(size);
			});

			launchListView();

			var window1 = codeshelf.window();
			window1.init("Facility Editor", frame_, limits_);

			var facilityEditor = codeshelf.facilityeditor();
			var content = window1.getContentElement();
			var innerPane = soy.renderAsElement(codeshelf.templates.facilityEditor);
			goog.dom.appendChild(content, innerPane);
			var mapPane = goog.dom.query('.facilityMap', innerPane)[0];
			window1.open();
			facilityEditor.start(application, mapPane);
		},

		exit:function () {
			websession_.setCurrentPage(undefined);
		},

		createMoverStart:function (mover) {
			var moverFunc = function moveWindowSetZ(e) {
				mover.style.zIndex = z_++;
				goog.style.setOpacity(mover, 0.50);
			};
			return moverFunc;
		},

		createMoverEnd:function (mover) {
			var moverFunc = function moveWindowEnd(e) {
				goog.style.setOpacity(mover, 1);
			}
			return moverFunc;
		},

		updateFrameSize:function (size) {
			// goog.style.setSize(goog.dom.getElement('frame'), size);
			frame_.style.width = size.width - 15 + 'px';
			frame_.style.height = size.height - 5 + 'px';
		}
	}
}
