/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditorGmapsOverlay.js,v 1.2 2012/04/28 00:38:44 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditorgmapsoverlay');

// To work well with GMap classical (non-FP) coding style we always have to patch the return object.
function ProtoHolder() {

}

ProtoHolder.prototype = new google.maps.OverlayView();

codeshelf.facilityeditorgmapsoverlay = function(map) {

	var map_ = map;
	var thisOverlay_ = new ProtoHolder();

	thisOverlay_.onAdd = function() {

	};

	thisOverlay_.draw = function() {

	}

	thisOverlay_.setMap(map);

	return thisOverlay_;
}



