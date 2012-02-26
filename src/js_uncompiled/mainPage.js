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

			this.updateFrameSize(goog.dom.getViewportSize());

			// Start listening for viewport size changes.
			var vsm = new goog.dom.ViewportSizeMonitor();
			goog.events.listen(vsm, goog.events.EventType.RESIZE, function (e) {
				size = vsm.getSize();
				size.height -= 10;
				thisMainpage_.updateFrameSize(size);
			});

			var listview = codeshelf.listview();
			listview.launchListView(frame_);

			var facilityEditor = codeshelf.facilityeditor();
			facilityEditor.start(application, frame_);
		},

		exit:function () {
			websession_.setCurrentPage(undefined);
		},

		updateFrameSize:function (size) {
			// goog.style.setSize(goog.dom.getElement('frame'), size);
			frame_.style.width = size.width - 15 + 'px';
			frame_.style.height = size.height - 5 + 'px';
		}
	}
}
