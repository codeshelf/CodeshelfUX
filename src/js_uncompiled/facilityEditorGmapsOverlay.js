/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditorGmapsOverlay.js,v 1.5 2012/11/08 03:35:10 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditorviewgmapsoverlay');

// To work well with GMap classical (non-FP) coding style we always have to patch the return object.
function ProtoHolder() {

}

codeshelf.facilityeditorviewgmapsoverlay = function(map) {

	var thisOverlay_;
	var map_ = map;

	thisOverlay_ = {

		init: function() {
			ProtoHolder.prototype = new google.maps.OverlayView();

			var thisOverlay_ = new ProtoHolder();

			thisOverlay_.onAdd = function() {

			};

			thisOverlay_.draw = function() {

			};

			thisOverlay_.setMap(map);
		}
	};

	return thisOverlay_;
};



