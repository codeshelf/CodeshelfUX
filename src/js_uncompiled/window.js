/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: window.js,v 1.17 2012/12/22 09:36:37 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.window');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.style');

codeshelf.window = function(view, parent, limits) {

	var view_ = view;
	var parent_ = parent; // might be null if first window opening.
	var limits_ = limits;

	var thisWindow_;
	var windowElement_;
	var contentPane_;
	var windowBar_;
	var dragger_;
	var resizer_;
	var z_ = 0;

	thisWindow_ = {

		open: function() {

			gWindowList[gWindowList.length] = thisWindow_;
			windowElement_ = soy.renderAsElement(codeshelf.templates.window);
			// In all cases, we will insert the new window after the navbar. That is, the new window will be the first
			// in the DOM list. This is how it worked before, except it used to start as child of frame instead of
			// sibling of navbar.

			// Might work better with mainPage.js if that found the window or navbar, and this just offset from what is passed.
			var theContainer = goog.dom.getElement("codeshelfwindows");

			// Default as we will if no existing window found
			var parentTopPosition = 55;
			var parentLeftPosition = 25;
			if (parent_ && parent_.className === "window") {
				// try the append public method. Might have to use insertSiblingAfter
				// goog.dom.appendChild(parent_, windowElement_);
				parentTopPosition = parseInt(goog.style.getComputedStyle(parent_, 'top'), 10);
				parentLeftPosition = parseInt(goog.style.getComputedStyle(parent_, 'left'), 10);
			}
			if (theContainer)
				goog.dom.appendChild(theContainer, windowElement_);
			else if (parent_) // Some error. We do not have our standard windows container. Now what?
				goog.dom.insertSiblingAfter(windowElement_, parent_);
			else {
				var theLogger = goog.debug.Logger.getLogger('window.js');
				theLogger.info("did not add window. No windows container?");
			}

			windowElement_.style.top = parentTopPosition + 25 + 'px';
			windowElement_.style.left = parentLeftPosition + 25 + 'px';

			var label = goog.dom.query('.windowTitle', windowElement_)[0];
			label.innerHTML = view_.getViewName();

			windowBar_ = goog.dom.query('.windowBar', windowElement_)[0];
			var windowResizer = goog.dom.query('.windowResizer', windowElement_)[0];

			dragger_ = new goog.fx.Dragger(windowElement_, windowBar_, limits_);
			resizer_ = new goog.fx.Dragger(windowResizer, windowResizer, limits_);

			goog.events.listen(windowBar_, goog.events.EventType.MOUSEDOWN, thisWindow_.focusWindowEventHandler(thisWindow_));

			// this close button is part of the windowBar_ for this window. Search from there in the dom.
			var theCloseButton = goog.dom.getElementsByTagNameAndClass(undefined,"close", windowBar_)[0];
			goog.events.listen(theCloseButton, goog.events.EventType.CLICK, thisWindow_.close());

			goog.events.listen(dragger_, goog.fx.Dragger.EventType.START, thisWindow_.moverStart(windowElement_));
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.END, thisWindow_.moverEnd(windowElement_));

			goog.events.listen(resizer_, goog.fx.Dragger.EventType.START, thisWindow_.moverStart(windowElement_));
			goog.events.listen(resizer_, goog.fx.Dragger.EventType.END, thisWindow_.moverEnd(windowElement_));

			goog.events.listen(dragger_, goog.fx.Dragger.EventType.DRAG, function(event) {
				event.dispose();
			});
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.BEFOREDRAG, function(event) {
				event.dispose();
			});

			goog.events.listen(windowElement_, goog.events.EventType.UNLOAD, function(event) {
				dragger_.dispose();
				resizer_.dispose();
			});

			resizer_.defaultAction = function(x, y) {
				var leftDim = parseInt(windowElement_.style.left, 10);
				var topDim = parseInt(windowElement_.style.top, 10);
				var width = resizer_.clientX - leftDim - 5;
				var height = resizer_.clientY - topDim - 10;
				windowElement_.style.width = width + 'px';
				windowElement_.style.height = height + 'px';
				view_.resize();
			};

			view_.setupView(thisWindow_.getContentElement());
			view_.open();
			thisWindow_.focusWindow();
		},

		close: function() {
			var closeFunction = function(event) {

				var closeButtonElement = event.currentTarget;
				// let the view dispose of anything special
				var promise = view_.close();
				//if promise returned, obey it
				if (promise != null) {
					promise.then(function onOk() {
						thisWindow_.disposeDOMWindowOwningThisElement(closeButtonElement);
					});
				}
				//otherwise do the usual
				else {
					thisWindow_.disposeDOMWindowOwningThisElement(closeButtonElement);
				}
				event.dispose();
			};
			return closeFunction;
		},

		/**
		 * find and close the DOM window corresponding to this close button click
		 */
		disposeDOMWindowOwningThisElement: function(inElement){

			var theOwnerWindow = goog.dom.getAncestorByClass(inElement, "window");
			goog.dom.removeChildren(theOwnerWindow);
			goog.dom.removeNode(theOwnerWindow);

		},

		getContentElement: function() {
			contentPane_ = goog.dom.query('.windowContent', windowElement_)[0];
			return contentPane_;
		},

		getWindowBar: function() {
			return windowBar_;
		},

		setZ: function(z) {
			windowElement_.style.zIndex = z;
		},

		focusWindowEventHandler: function(window) {
			var focusWindow_ = window;
			var focusFuction = function(event) {
				thisWindow_.focusWindow();
				event.dispose();
			};
			return focusFuction;
		},

		focusWindow: function() {
			// Loop through all of the windows, and set their Z to 0, but set this window's Z to 1.
			for (var i in gWindowList) {
				if (gWindowList.hasOwnProperty(i)) {
					var aWindow = gWindowList[i];

					var windowBar = aWindow.getWindowBar();
					if (aWindow === thisWindow_) {
						aWindow.setZ(1);
						windowBar.className = 'windowBar-selected';
					} else {
						aWindow.setZ(0);
						windowBar.className = 'windowBar';
					}
				}
			}
		},

		moverStart: function(mover) {
			var mover_ = mover;

			var moverFunction = function moveWindowStart(event) {
				goog.style.setOpacity(mover_, 0.85);
				event.dispose();
			};
			return moverFunction;
		},

		moverEnd: function(mover) {
			var mover_ = mover;

			var moverFunction = function moveWindowEnd(event) {
				goog.style.setOpacity(mover_, 1);
				event.dispose();
			};
			return moverFunction;
		}
	};

	return thisWindow_;
};
