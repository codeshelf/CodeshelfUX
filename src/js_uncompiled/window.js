/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: window.js,v 1.6 2012/04/29 09:58:22 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.window');
goog.require('goog.style');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');

var windowList = [];
var xPosOffset = 0;
var yPosOffset = 0;

codeshelf.window = function() {

	var thisWindow_;
	var windowElement_;
	var parent_;
	var contentPane_;
	var limits_;
	var dragger_;
	var resizer_;
	var z_ = 0;

	thisWindow_ = {
		init: function(title, parent, limits, resizeFunction) {

			parent_ = parent;
			limits_ = limits;
			windowList[windowList.length] = thisWindow_;
			windowElement_ = soy.renderAsElement(codeshelf.templates.window);
			goog.dom.appendChild(parent_, windowElement_);

			// Set the window to the next stagger position.
			var curTop = parseInt(goog.style.getComputedStyle(windowElement_, 'top'), 10);
			windowElement_.style.top = curTop + xPosOffset + 'px';
			xPosOffset += 25;
			var curLeft = parseInt(goog.style.getComputedStyle(windowElement_, 'left'), 10);
			windowElement_.style.left = curLeft + yPosOffset + 'px';
			yPosOffset += 25;


			var label = goog.dom.query('.windowTitle', windowElement_)[0];
			label.innerHTML = title;

			var windowBar = goog.dom.query('.windowBar', windowElement_)[0];
			var windowResizer = goog.dom.query('.windowResizer', windowElement_)[0];

			dragger_ = new goog.fx.Dragger(windowElement_, windowBar, limits_);
			resizer_ = new goog.fx.Dragger(windowResizer, windowResizer, limits_);

			goog.events.listen(windowBar, goog.events.EventType.MOUSEDOWN, thisWindow_.focusWindowEventHandler(thisWindow_));

			goog.events.listen(dragger_, 'start', thisWindow_.moverStart(windowElement_));
			goog.events.listen(dragger_, 'end', thisWindow_.moverEnd(windowElement_));

			goog.events.listen(resizer_, 'start', thisWindow_.moverStart(windowElement_));
			goog.events.listen(resizer_, 'end', thisWindow_.moverEnd(windowElement_));

			goog.events.listen(windowElement_, goog.events.EventType.UNLOAD, function(e) {
				dragger_.dispose();
				resizer_.dispose();
			});

			resizer_.defaultAction = function(x, y) {
				var leftDim = parseInt(windowElement_.style.left, 10);
				var topDim = parseInt(windowElement_.style.top, 10);
				var width = resizer_.clientX - leftDim;
				var height = y + topDim - 10;
				windowElement_.style.width = width + 'px';
				windowElement_.style.height = height + 'px';
				resizeFunction();
			};
		},

		open: function() {
			thisWindow_.focusWindow();
		},

		close: function() {

		},

		getContentElement: function() {
			contentPane_ = goog.dom.query('.windowContent', windowElement_)[0];
			return contentPane_;
		},

		setZ: function(z) {
			windowElement_.style.zIndex = z;
		},

		focusWindowEventHandler: function(aWindow) {
			var focusWindow_ = aWindow;
			var focusFuction = function(event) {
				thisWindow_.focusWindow();
			}
			return focusFuction;
		},

		focusWindow: function() {
			// Loop throught all of the windows, and set their Z to 0, but set this window's Z to 1.
			for (var i in windowList) {
				var aWindow = windowList[i];
				if (aWindow === thisWindow_) {
					aWindow.setZ(1);
				} else {
					aWindow.setZ(0);
				}
			}
		},

		moverStart: function(mover) {
			var mover_ = mover;

			var moverFunction = function moveWindowStart(event) {
				goog.style.setOpacity(mover_, 0.50);
			};
			return moverFunction;
		},

		moverEnd: function(mover) {
			var mover_ = mover;

			var moverFunction = function moveWindowEnd(event) {
				goog.style.setOpacity(mover_, 1);
			}
			return moverFunction;
		}
	}

	return thisWindow_;
}