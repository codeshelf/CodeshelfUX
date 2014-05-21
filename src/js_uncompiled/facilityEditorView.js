/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditorView.js,v 1.42 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditorview');
goog.require('codeshelf.dataobjectfield');
goog.require('codeshelf.sessionGlobals');
//goog.require('codeshelf.facilityeditorviewgmapsoverlay');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('codeshelf.workareaeditorview');
goog.require('domainobjects');
goog.require('extern.jquery');
goog.require('extern.jquery.css.rotate');
goog.require('extern.jquery.css.transform');
goog.require('goog.dom.query');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');

codeshelf.facilityeditorview = function (websession, facility) {
// organization not used, so no longer passed as parameter
	var websession_ = websession;
	var facility_ = facility;

	var map_;
	var clickHandler_;
	var doubleClickHandler_;
	var clickTimeout_;
	var mapPane_;
//	var mapRotatePane_;
	var facilityBounds_;
//	var facilityEditorOverlay_;
	var facilityOutlinePath_;
	var facilityOutlineVertices_ = [];
	var facilityOutline_;
	var facilityAnchorMarker_ = undefined;
	var canEditOutline_ = true;
	var localUserCreatedMarker_ = false;
	var geocoder_;
	var googleField_;
	var uniqueIdFunc_ = goog.events.getUniqueId;

	var infoWindow_;
	var totalBounds_;
	var overlays_ = [];

	function clickHandler(event) {
		clickTimeout_ = setTimeout(function () {

			if (canEditOutline_) {
				// We need to make sure the structures get created before we set the user create marker.
				localUserCreatedMarker_ = true;
				ensureOutlineStructures();

				var vertexNum = getNextVertexNum();

				// If two segments are close to 90deg then make then exactly 90deg.
				if (vertexNum > 1) {
					var vertexA = facilityOutlineVertices_[vertexNum - 2];
					var vertexB = facilityOutlineVertices_[vertexNum - 1];
					checkSquareness(event, vertexA.marker.getPosition(), vertexB.marker.getPosition());
				}

				// If the this segment forms an angle of 85-95deg with an imaginary angle back to vertex zero
				// then extend or shorten this segment to make it exactly 90deg.

				var data = {
					'className': domainobjects['Facility']['className'],
					'persistentId': facility_['persistentId'],
					'methodName': 'createVertex',
					'methodArgs': [
						{'name': 'domainId', 'value': 'V' + vertexNum, 'classType': 'java.lang.String'},
						{'name': 'PosTypeByStr', 'value': 'GPS', 'classType': 'java.lang.String'},
						{'name': 'anchorPosX', 'value': event.latLng.lng(), 'classType': 'java.lang.Double'},
						{'name': 'anchorPosY', 'value': event.latLng.lat(), 'classType': 'java.lang.Double'},
						{'name': 'drawOrder', 'value': vertexNum, 'classType': 'java.lang.Integer'}
					]
				};

				var newVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
				websession_.sendCommand(newVertexCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_METHOD_RESP), false);

				// If this was the anchor vertex then set the location of the facility as well.
				var anchorPoint = {'posTypeEnum': 'GPS', 'x': event.latLng.lng(), 'y': event.latLng.lat(), 'z' : 0.0};
				var data = {
					'className': domainobjects['Facility']['className'],
					'persistentId': facility_['persistentId'],
					'properties': [
						{'name': 'anchorPoint', 'value': anchorPoint, 'classType': 'com.gadgetworks.codeshelf.model.domain.Point'}
					]
				};
				var moveVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
				websession_.sendCommand(moveVertexCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
			}
		}, 250);
	}

	function doubleClickHandler(event) {
		clearTimeout(clickTimeout_);
		if (canEditOutline_) {
			deleteFacilityOutline();
		}
	}

	function checkSquareness(event, latLngA, latLngB) {
		var heading1 = getNormalizedHeading(latLngA, latLngB);
		var heading2 = getNormalizedHeading(latLngB, event.latLng);
		var diff = Math.abs(heading1 - heading2);
		if (diff > 180) {
			diff -= 180;
		}
		var dist = google.maps.geometry.spherical.computeDistanceBetween(latLngB, event.latLng);
		if ((diff > 80) && (diff < 100)) {
			if (heading1 < heading2) {
				heading2 += 90 - diff;
			} else {
				heading2 += diff - 90;
			}
			event.latLng = google.maps.geometry.spherical.computeOffset(latLngB, dist, heading2);
		}

		// Now check to see if we're close to 90deg of the anchor marker.
		var anchorHeading = getNormalizedHeading(event.latLng, facilityAnchorMarker_.getPosition());
		diff = getNormalizedDiff(anchorHeading, heading2);
		if ((diff > 270 ) && (diff < 280)) {
			while (diff > 270) {
				dist *= 1.001;
				event.latLng = google.maps.geometry.spherical.computeOffset(latLngB, dist, heading2);
				anchorHeading = getNormalizedHeading(event.latLng, facilityAnchorMarker_.getPosition());
				diff = getNormalizedDiff(anchorHeading, heading2);
			}
		} else if ((diff > 260 ) && (diff < 270)) {
			while (diff < 270) {
				dist *= 0.999;
				event.latLng = google.maps.geometry.spherical.computeOffset(latLngB, dist, heading2);
				anchorHeading = getNormalizedHeading(event.latLng, facilityAnchorMarker_.getPosition());
				diff = getNormalizedDiff(anchorHeading, heading2);
			}
		} else if ((diff > 90) && (diff < 100)) {
			while (diff > 90) {
				dist *= 0.999;
				event.latLng = google.maps.geometry.spherical.computeOffset(latLngB, dist, heading2);
				anchorHeading = getNormalizedHeading(event.latLng, facilityAnchorMarker_.getPosition());
				diff = getNormalizedDiff(anchorHeading, heading2);
			}
		} else if ((diff > 80) && (diff < 90)) {
			while (diff < 90) {
				dist *= 1.001;
				event.latLng = google.maps.geometry.spherical.computeOffset(latLngB, dist, heading2);
				anchorHeading = getNormalizedHeading(event.latLng, facilityAnchorMarker_.getPosition());
				diff = getNormalizedDiff(anchorHeading, heading2);
			}
		}
	}

	function getNormalizedDiff(a, b) {
		// Normalize a to "0" so that "0" doesn't show up in the middle of our difference angle.
		var result = b -= a;
		if (result < 0) {
			result += 360;
		}
		return result;
	}

	function getNormalizedHeading(latLngA, latLngB) {
		var heading = google.maps.geometry.spherical.computeHeading(latLngA, latLngB);
		if (heading < 0) {
			heading += 360;
		}
		return heading;
	}

	function ensureOutlineStructures() {
		if (facilityOutlinePath_ === undefined) {

			facilityBounds_ = undefined;

			// Setup the outline management for the facility.
			facilityOutlinePath_ = new google.maps.MVCArray;
			if (localUserCreatedMarker_ === true) {
				facilityOutline_ = new google.maps.Polyline({
					'strokeWeight': 3,
					'strokeColor': '#ff0000',
					'fillColor': '#0000cc'
				});
			} else {
				facilityOutline_ = new google.maps.Polygon({
					'strokeWeight': 3,
					'strokeColor': '#ff0000',
					'fillColor': '#0000cc'
				});
			}

			facilityOutline_.setMap(map_);
			facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));
		}
	}

	function getNextVertexNum() {
		// The vertex number if the count of the valid vertices so far.
		var vertexNum = 0;
		for (var i = 0; i < Object.size(facilityOutlineVertices_); i++) {
			if ((facilityOutlineVertices_[i] !== null) && (facilityOutlineVertices_[i] !== undefined)) {
				vertexNum++;
			}
		}
		return vertexNum;
	}

	function handleCreateFacilityVertexCmd(latLng, vertex) {

		ensureOutlineStructures();
		facilityOutlinePath_.setAt(vertex['drawOrder'], latLng);
		facilityOutline_.setVisible(true);

		// The case where we're adding a new marker (maybe even the anchor marker) that we must show.
		var iconUrl = '../icons/marker_20_blue.png';
		if (vertex['drawOrder'] === 0) {
			iconUrl = '../icons/marker_20_red.png';
		}

		var markerImage = new google.maps.MarkerImage(
			iconUrl,
			new google.maps.Size(12, 20),
			new google.maps.Point(0, 0),
			new google.maps.Point(6, 19)
		);

		var marker = new google.maps.Marker({
			'position': latLng,
			'map': map_,
			'draggable': true,
			'icon': markerImage
		});

		var vertexData = {marker: marker, Vertex: vertex};
		facilityOutlineVertices_[vertex['drawOrder']] = vertexData;
		marker.setTitle(vertex['domainId']);

		// Add a drag handler to the marker.
		google.maps.event.addListener(marker, 'dragend', function () {
				if (canEditOutline_) {
					facilityOutlinePath_.setAt(vertexData.Vertex['drawOrder'], marker.getPosition());

					if (canEditOutline_) {
						var anchorPoint = {'posTypeEnum': 'GPS', 'x': marker.getPosition().lng(), 'y': marker.getPosition().lat(), 'z' : 0.0};
						var data = {
							'className': domainobjects['Vertex']['className'],
							'persistentId': vertex['persistentId'],
							'properties': [
								{'name': 'point', 'value': anchorPoint, 'classType' : 'com.gadgetworks.codeshelf.model.domain.Point'}
							]
						};
						var moveVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ,
							data);
						websession_.sendCommand(moveVertexCmd,
							websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP),
							false);
					}
				}
			}
		);
//			}

		//  The vertex at DrawPos 0 goes to the anchor marker.
		if (vertex['drawOrder'] === 0) {
			facilityAnchorMarker_ = marker;
			// If the user clicks on the anchor marker then create a final marker on top of the anchor, and prevent further markers.
			// When the update returns this will close the polyline into a polygon.
			google.maps.event.addListener(facilityAnchorMarker_, goog.events.EventType.CLICK, function () {
					if (canEditOutline_) {
						facilityOutline_.setMap(null);
						completePolygon();
					}
				}
			);
		}

		setBounds();

//			            var newPoint;
//			            var longLat;
//			            var rotateDeg = 0;
//						var clickPoint = projection.fromLatLngToContainerPixel(event.latLng);
//						for (var deg = 0; deg <= 360; deg += 10) {
//							var rotatePoint = rotatePoint(clickPoint.x, clickPoint.y, mapPane_.clientWidth / 2, mapPane_.clientHeight / 2, deg);
//							newPoint = new google.maps.Point(rotatePoint.x, rotatePoint.y);
//							longLat = projection.fromContainerPixelToLatLng(newPoint, true);
//							pen_.draw(longLat);
//						}
	}

	function handleUpdateFacilityVertexCmd(latLng, vertex) {
		if ((facilityOutlinePath_ === undefined) || (facilityOutlinePath_.getAt(vertex['drawOrder']) === undefined)) {
			// If the outline or marker don't exist then create them.
			handleCreateFacilityVertexCmd(latLng, vertex);
		} else {
			// The outline and marker exist, so update the  marker.
			facilityOutlinePath_.setAt(vertex['drawOrder'], latLng);
			var vertexData = facilityOutlineVertices_[vertex['drawOrder']];
			vertexData.marker.setPosition(latLng);
		}
		setBounds();
	}

	function handleDeleteFacilityVertexCmd(latLng, vertex) {
		var vertexData = facilityOutlineVertices_[vertex['drawOrder']];
		facilityOutlineVertices_[vertex['drawOrder']] = undefined;

		if (vertexData !== undefined) {
			vertexData.marker.setMap(null);
			facilityOutlinePath_.setAt(vertex['drawOrder'], undefined);

			if (vertex['drawOrder'] === 0) {
				facilityAnchorMarker_ = undefined;
			}
		}

		// If we've deleted all of the vertices then we need to re-init the outline structures.
		// (Seems like an error in GMaps)
		var shouldInit = true;
		for (var i = 0; i < facilityOutlineVertices_.length; i++) {
			if (facilityOutlineVertices_[i] !== undefined) {
				shouldInit = false;
			}
		}
		if (shouldInit) {
			facilityOutlinePath_ = undefined;
			//localUserCreatedMarker_ = false;
			ensureOutlineStructures();
			facilityOutlineVertices_ = [];
			facilityOutline_.setPath(null);
			facilityOutlinePath_ = undefined;
		}
	}

	function deleteFacilityOutline() {
		// Clear all of the markers from the map.
		for (var i = Object.size(facilityOutlineVertices_) - 1; i >= 0; i--) {

			var data = {
				'className': domainobjects['Vertex']['className'],
				'persistentId': facilityOutlineVertices_[i].Vertex['persistentId']
			};

			var newVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_DELETE_REQ, data);
			websession_.sendCommand(newVertexCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_DELETE_RESP), false);
		}
	}

	function completePolygon() {
		// First make the outline into a polygon.
		facilityOutline_ = new google.maps.Polygon({
			'strokeWeight': 3,
			'strokeColor': '#ff0000',
			'fillColor': '#0000cc'
		});
		facilityOutline_.setMap(map_);
		facilityOutline_.setPath(facilityOutlinePath_);

		// Now make the second and last markers green.
		var iconUrl = '../icons/marker_20_green.png';
		var markerImage = new google.maps.MarkerImage(
			iconUrl,
			new google.maps.Size(12, 20),
			new google.maps.Point(0, 0),
			new google.maps.Point(6, 19)
		);

//			// The thing we need to rotate in GMaps is a map-div layer that's two layers down.
//			// Warning: this is a hack discovered by hacking into GMaps.
//			//mapRotatePane_ = mapRotatePane_[0].firstChild.firstChild;
//			mapRotatePane_ = $('.facilityMap > div:first-child > div:first-child');
//			mapRotatePane_[0].style.overflow = "visible";
//
//			// Setup green rotate marker #1.
//			var marker1 = facilityOutlineVertices_[1].marker;
//			var bearing1 = 90 - google.maps.geometry.spherical.computeHeading(facilityAnchorMarker_.getPosition(), marker1.getPosition());
//			//var bearing1 = -1 * bearing(facilityAnchorMarker_.getPosition(), marker1.getPosition()) / 2;
//			marker1.setIcon(markerImage);
//			google.maps.event.addListener(marker1, goog.events.EventType.CLICK, function() {
//					if (canEditOutline_) {
//						map_.setCenter(facilityAnchorMarker_.getPosition());
//						mapRotatePane_.animate({rotate: bearing1 + 'deg'});
//						setBounds();
//					}
//				}
//			)
//
//			// Setup green rotate marker #2.
//			var marker2 = facilityOutlineVertices_[Object.size(facilityOutlineVertices_) - 1].marker;
//			var bearing2 = 90 - google.maps.geometry.spherical.computeHeading(facilityAnchorMarker_.getPosition(), marker2.getPosition());
//			//var bearing2 = bearing(facilityAnchorMarker_.getPosition(), marker2.getPosition()) / 2;
//			marker2.setIcon(markerImage);
//			google.maps.event.addListener(marker2, goog.events.EventType.CLICK, function() {
//					if (canEditOutline_) {
//						map_.setCenter(facilityAnchorMarker_.getPosition());
//						mapRotatePane_.animate({rotate: bearing2 + 'deg'});
//						setBounds();
//					}
//				}
//			)
	}

	function computeGeoCodeResults(response, status) {
		if (status == google.maps.GeocoderStatus.OK && response[0]) {
			// we save them all
			geocoder_.responseSet.push(response);
			showGeocodeResult(0, geocoder_.responseIndex);
			geocoder_.responseIndex++;
		}
	}

	function showGeocodeResult(ind, setIndex) {
		var results = geocoder_.responseSet[setIndex];
		var box = results[ind].geometry.bounds;
		var color = '#0000ff';
		if (!box) {
			color = '#ff0000';
			box = results[ind].geometry.viewport;
		}
		var html = 'No address';
		if (results[ind].address_components[0]) {
			html = results[ind].address_components[0].long_name;
		}
		var overlay = new google.maps.Rectangle({
			'map': map_,
			'bounds': box,
			'strokeColor': color,
			'fillColor': color,
			'visible': false
		});
		overlays_.push(overlay);
		map_.fitBounds(box);
		totalBounds_.union(box);

		// Save that next geocode won't overwrite.
		overlay.setIndex = setIndex;
		if (Object.size(results) > 1) {
			for (var i = 0; i < Object.size(results); i++) {
				results[i].id = 'addr' + i;
			}
			var mapSearchItems = soy.renderAsElement((function () {
				var ind_ = ind;
				return function () {
					return    codeshelf.templates.gmapsAddrSearchInfoPopup({searchAddress: results[ind_].formatted_address, resultAddresses: results});
				}
			})());

			for (var i = 0; i < Object.size(results); i++) {

				var selectorId = '> #' + results[i].id;
				var addrElement = goog.dom.query(selectorId, mapSearchItems);
				if (Object.size(addrElement) > 0) {
					addrElement[0].onclick = (function () {
						var thisOverlay_ = overlay;
						var index_ = i;
						return function () {
							showGeocodeResult(index_, thisOverlay_.setIndex);
						}
					})();
				}
			}

		}

		infoWindow_.setPosition(results[ind].geometry.location);
		//infoWindow_.setContent(overlay.story.join(""));
		infoWindow_.setContent(mapSearchItems);
		infoWindow_.open(map_);
		google.maps.event.addListener(overlay, 'click', function () {
			infoWindow_.setPosition(results[ind].geometry.location);
			infoWindow_.setContent(mapSearchItems);
			infoWindow_.open(map_);
		});
	}

	function rotatePoint(x, y, xm, ym, a) {
		var cos = Math.cos;
		var sin = Math.sin;

		// Convert to radians because that's what JavaScript likes
		var a = a * Math.PI / 180;

		// Subtract midpoints, so that midpoint is translated to origin and add it in the end again
		var xr = (x - xm) * cos(a) - (y - ym) * sin(a) + xm;
		var yr = (x - xm) * sin(a) + (y - ym) * cos(a) + ym;

		return {'x': xr, 'y': yr};
	}

	function setBounds() {
//		map_.setCenter(facilityAnchorMarker_.getPosition());
		var len = Object.size(facilityOutlineVertices_);
		if (len > 2) {
			// Figure out a new bounds for the facility outline.
			if (facilityBounds_ === undefined) {
				facilityBounds_ = new google.maps.LatLngBounds();
			}
			for (var vertexPos in facilityOutlineVertices_) {
				if (facilityOutlineVertices_.hasOwnProperty(vertexPos)) {
					var vertex = facilityOutlineVertices_[vertexPos];
					var latLng = vertex.marker.getPosition();
					facilityBounds_.extend(latLng);
				}
			}
			map_.fitBounds(facilityBounds_);
		}
	}

	function logFacilityResponse(inStringToLog) {
		//uncomment to really see the updates on facility view
		if (false) {
			var theLogger = goog.debug.Logger.getLogger('FacilityWebsocketResponse');
			theLogger.info(inStringToLog);
		}
	}

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function (command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['data']['results'].length; i++) {
							var object = command['data']['results'][i];

							// Make sure the class name matches.
							if (object['className'] === domainobjects['Vertex']['className']) {
								var latLng = new google.maps.LatLng(object['posY'], object['posX']);
								if (object['op'] === 'cre') {
									logFacilityResponse('FILTER_RESP:cre');
									handleCreateFacilityVertexCmd(latLng, object);
								} else if (object['op'] === 'upd') {
									logFacilityResponse('FILTER_RESP:upd -- init or update vertex from backend');
									handleUpdateFacilityVertexCmd(latLng, object);
								} else if (object['op'] === 'dl') {
									logFacilityResponse('FILTER_RESP:dl -- delete vertex from backend');
									handleDeleteFacilityVertexCmd(latLng, object);
								}
							}
						}
					} else if (command['type'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
						logFacilityResponse('UPDATE_RESP -- ack the vertext update that I sent');
					} else if (command['type'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
						logFacilityResponse('UPDATE_RESP -- ack the vertex delete that I sent');
					}
				}
			}
		};

		return callback;
	}

	/**
	 * THe facility editor view public functions.
	 * @type {Object}
	 */
	var self = {

		getViewName: function () {
			return 'Facility Editor';
		},

		doSetupView: function () {

			// Starting latlng is either the facility's origin point or the browser's current location (if we can get it).
			var demoLatLng = new google.maps.LatLng(facility_['anchorPosY'], facility_['anchorPosX']);

			var codeshelfMapStyle = [
				{
					featureType: "administrative",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
				},
				{
					featureType: "poi",
					elementType: "all",
					stylers: [
						{ visibility: "off" }
					]
				},
				{
					featureType: "water",
					elementType: "labels",
					stylers: [
						{ visibility: "off" }
					]
				},
				{
					featureType: "road",
					elementType: "labels",
					stylers: [
						{ visibility: "on" }
					]
				}
			];

			var myOptions = {
				mapTypeControlOptions: {
					mapTypeIds: ['codeshelfMapStyle', google.maps.MapTypeId.HYBRID]
				},
				'zoom': 16,
				'center': demoLatLng,
				'mapTypeId': google.maps.MapTypeId.HYBRID,
				'disableDoubleClickZoom': true,
				'panControl': false,
				'rotateControl': true,
				'streetViewControl': false,
				//'draggableCursor':        'url(../../src/images/push-pin.png), auto',
				'draggableCursor': 'pointer',
				'heading': 180,
				'tilt': 0
			};

			infoWindow_ = new google.maps.InfoWindow();
			totalBounds_ = new google.maps.LatLngBounds();

			// Add the facility descriptor field.
			var facilityDescField = codeshelf.dataobjectfield(websession_, self.getMainPaneElement(),
				domainobjects['Facility']['className'],
				domainobjects['Facility']['properties']['description']['id'],
				facility_['persistentId'],
				'windowField', 'Facility name');
			facilityDescField.start();

			// Setup GMaps geocoding to locate places for the user (if needed).
			geocoder_ = new google.maps.Geocoder();
			geocoder_.responseIndex = 0;
			geocoder_.responseSet = [];

			var fieldId = uniqueIdFunc_('search');
			var fieldElement = soy.renderAsElement(codeshelf.templates.dataObjectField,
				{id: fieldId, cssClass: 'windowField', label: 'Search for address'});
			goog.dom.appendChild(self.getMainPaneElement(), fieldElement);
			var inputElement = goog.dom.getElement(fieldId);
			googleField_ = new goog.ui.LabelInput('Search for address');
			googleField_.decorate(inputElement);


			goog.events.listen(inputElement, goog.editor.Field.EventType.CHANGE, function (event) {
				var text = googleField_.getValue();
				geocoder_.geocode({'address': text}, computeGeoCodeResults);
			});

			// Add the graphical editor.
			var editorPane = soy.renderAsElement(codeshelf.templates.facilityEditor);
			goog.dom.appendChild(self.getMainPaneElement(), editorPane);
			mapPane_ = goog.dom.query('.facilityMap', editorPane)[0];
			google.maps.visualRefresh = true;
			map_ = new google.maps.Map(mapPane_, myOptions);
			map_.mapTypes.set('codeshelfMapStyle', new google.maps.StyledMapType(codeshelfMapStyle, { name: 'Codeshelf' }));
			map_.setMapTypeId('codeshelfMapStyle');


//			facilityEditorOverlay_ = codeshelf.facilityeditorviewgmapsoverlay(map_);
//			facilityEditorOverlay_.init();

			clickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.CLICK, clickHandler);
			doubleClickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.DBLCLICK, doubleClickHandler);
		},

		open: function () {
			// Create the filter to listen to all vertex updates for this facility.
			var data = {
				'className': domainobjects['Vertex']['className'],
				'propertyNames': ['domainId', 'posTypeEnum', 'posX', 'posY', 'drawOrder'],
				'filterClause': 'parent.persistentId = :theId',
				'filterParams': [
					{ 'name': 'theId', 'value': facility_['persistentId']}
				]
			};

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP),
				true);
		},

		close: function () {
			this.exit(); // disconnect the google maps APIs. Maybe exit is not a good name.
		},

		doResize: function () {
			facilityBounds_ = undefined;
			google.maps.event.trigger(mapPane_, 'resize');
			setBounds();
		},

		exit: function () {
			google.maps.event.removeListener(clickHandler_);
			google.maps.event.removeListener(doubleClickHandler_);
		}
	};

// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;


	return self;
}
;
