/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditorGmapsOverlay.js,v 1.3 2012/05/08 01:02:01 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditorviewgmapsoverlay');

// To work well with GMap classical (non-FP) coding style we always have to patch the return object.
function ProtoHolder() {

}

ProtoHolder.prototype = new google.maps.OverlayView();

codeshelf.facilityeditorviewgmapsoverlay = function(map) {

	var map_ = map;
	var thisOverlay_ = new ProtoHolder();

	thisOverlay_.onAdd = function() {

	};

	thisOverlay_.draw = function() {

	}

	thisOverlay_.setMap(map);

	return thisOverlay_;
}



