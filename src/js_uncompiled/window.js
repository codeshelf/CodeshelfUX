goog.provide('codeshelf.window');
goog.require('goog.style');
goog.require('goog.dom.query');

codeshelf.window = function() {

	var window_;
	var parent_;
	var contentPane_;
	var limits_;
	var dragger_;
	var resizer_;
	var z_ = 0;

	return {
		init: function(title, parent, limits) {

			parent_ = parent;
			limits_ = limits;
			window_ = soy.renderAsElement(codeshelf.templates.window);

			goog.dom.appendChild(parent_, window_);

			var label = goog.dom.query('.windowTitle', window_)[0];
			label.innerHTML = title;
		},

		open: function() {
			var windowBar = goog.dom.query('.windowBar', window_)[0];
			var windowResizer = goog.dom.query('.windowResizer', window_)[0];

			dragger_ = new goog.fx.Dragger(window_, windowBar, limits_);
			resizer_ = new goog.fx.Dragger(windowResizer, windowResizer, limits_);

			goog.events.listen(dragger_, 'start', this.moverStart(window_));
			goog.events.listen(dragger_, 'end', this.moverEnd(window_));

			goog.events.listen(resizer_, 'start', this.moverStart(window_));
			goog.events.listen(resizer_, 'end', this.moverEnd(window_));

			goog.events.listen(window_, 'unload', function (e) {
				dragger_.dispose();
				resizer_.dispose();
			});

			resizer_.defaultAction = function (x, y) {
				leftDim = parseInt(window_.style.left, 10);
				topDim = parseInt(window_.style.top, 10);
				width = this.screenX - leftDim;
				height = y + topDim - 10;
				window_.style.width = width + 'px';
				window_.style.height = height + 'px';
			};
		},

		close: function() {

		},

		getContentElement: function() {
			contentPane_ = goog.dom.query('.windowContent', window_)[0];
			return contentPane_;
		},

		moverStart:function (mover) {
			var mover_ = mover;

			var moverFunc = function moveWindowSetZ(e) {
				mover_.style.zIndex = z_++;
				goog.style.setOpacity(mover_, 0.50);
			};
			return moverFunc;
		},

		moverEnd:function (mover) {
			var mover_ = mover;

			var moverFunc = function moveWindowEnd(e) {
				goog.style.setOpacity(mover_, 1);
			}
			return moverFunc;
		}
	}
}