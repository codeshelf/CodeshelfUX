/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditor.js,v 1.32 2012/04/22 20:15:11 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditor');
goog.require('codeshelf.templates');
goog.require('codeshelf.facilityeditorgmapsoverlay');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.dataobjectfield');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('jquery.css-rotate');
goog.require('jquery.css-transform');


var newPoint;
var longLat;
var rotateDeg = 0;

/**
 * @param {google.maps.LatLng} newLatLng
 * @returns {number}
 */
google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
	// setup our variables
	var lat1 = this.lat();
	var radianLat1 = lat1 * ( Math.PI / 180 );
	var lng1 = this.lng();
	var radianLng1 = lng1 * ( Math.PI / 180 );
	var lat2 = newLatLng.lat();
	var radianLat2 = lat2 * ( Math.PI / 180 );
	var lng2 = newLatLng.lng();
	var radianLng2 = lng2 * ( Math.PI / 180 );
	// sort out the radius, MILES or KM?
	var earth_radius = 3959; // (km = 6378.1) OR (miles = 3959) - radius of the earth

	// sort our the differences
	var diffLat = ( radianLat1 - radianLat2 );
	var diffLng = ( radianLng1 - radianLng2 );
	// put on a wave (hey the earth is round after all)
	var sinLat = Math.sin(diffLat / 2);
	var sinLng = Math.sin(diffLng / 2);

	// maths - borrowed from http://www.opensourceconnections.com/wp-content/uploads/2009/02/clientsidehaversinecalculation.html
	var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);

	// work out the distance
	var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));

	// return the distance
	return distance;
}

codeshelf.facilityeditor = function () {

	var map_;
	var clickHandler_;
	var doubleClickHandler_;
	var clickTimeout_;
	var websession_;
	var organization_;
	var mapPane_;
	var mapRotatePane_;
	var thisFacilityEditor_;
	var facility_;
	var facilityEditorOverlay_;
	var facilityOutlinePath_;
	var facilityOutlineVertices_ = [];
	var facilityOutline_;
	var facilityAnchorMarker_ = null;
	var canEditFacility_ = true;
	var canEditOutline_ = true;

	thisFacilityEditor_ = {
		start:function (websession, organization, parentFrame, facility) {

			websession_ = websession;
			facility_ = facility;
			organization_ = organization;

			// Add the Google Maps scripts (There's no way to wait for this to load - put it in the header.)
			//goog.dom.appendChild(goog.dom.getDocument().head, soy.renderAsElement(codeshelf.templates.googleMapsScripts));

			// Safeway DC Tracy, CA
			var demoLatLng = new google.maps.LatLng(facility_.posY, facility_.posX);
			var myOptions = {
				zoom:                  16,
				center:                demoLatLng,
				mapTypeId:             google.maps.MapTypeId.HYBRID,
				disableDoubleClickZoom:true,
				panControl:            false,
				rotateControl:         false,
				streetViewControl:     false,
				draggableCursor:       'url(file://../src/images/push-pin.png), auto',
				heading:               180,
				tilt:                  0
			}

			//map_ = new google.maps.Map(goog.dom.query('#facility_map')[0], myOptions);
			var editorWindow = codeshelf.window();
			editorWindow.init("Facility Editor", parentFrame, undefined, this.resizeFunction);
			editorWindow.open();
			var contentPane = editorWindow.getContentElement();

			// Add the facility descriptor field.
			var facilityDescField = codeshelf.dataobjectfield(websession_, contentPane, codeshelf.domainobjects.facility.classname, codeshelf.domainobjects.facility.properties.description.id, facility_.persistentId);
			facilityDescField.start();

			// Add the graphical editor.
			var editorPane = soy.renderAsElement(codeshelf.templates.facilityEditor);
			goog.dom.appendChild(contentPane, editorPane);
			mapPane_ = goog.dom.query('.facilityMap', editorPane)[0];
			mapRotatePane_ = $('.facilityMap');
			map_ = new google.maps.Map(mapPane_, myOptions);
			facilityEditorOverlay_ = codeshelf.facilityeditorgmapsoverlay(map_);

			//pen_ = codeshelf.facilityeditor.pen(map_);

			// Setup the outline management for the facility.
			facilityOutlinePath_ = new google.maps.MVCArray;
			facilityOutline_ = new google.maps.Polyline({
				strokeWeight:3,
				strokeColor: '#ff0000',
				fillColor:   '#0000cc'
			});
			facilityOutline_.setMap(map_);
			facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));

			clickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.CLICK, function (event) {
					clickTimeout_ = setTimeout(function () {

						if (canEditOutline_) {
							var vertexNum = 0;
							for (var i = 0; i < facilityOutlineVertices_.length; i++) {
								if ((facilityOutlineVertices_[i] !== null ) && (facilityOutlineVertices_[i] !== undefined )) {
									vertexNum++;
								}
							}

							var data = {
								parentClassName:   codeshelf.domainobjects.facility.classname,
								parentPersistentId:facility_.persistentId,
								className:         codeshelf.domainobjects.vertex.classname,
								properties:        [
									{name:'DomainId', value:'V' + vertexNum},
									//{name:'Description', value:'First Facility'},
									{name:'PosTypeByStr', value:'GPS'},
									{name:'PosX', value:event.latLng.lng()},
									{name:'PosY', value:event.latLng.lat()},
									{name:'DrawOrder', value:vertexNum}
								]
							}

							var newVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_CREATE_REQ, data);
							websession_.sendCommand(newVertexCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_CREATE_RESP), false);
						}
					}, 250);
				}
			)

			doubleClickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.DBLCLICK, function (event) {
				clearTimeout(clickTimeout_);
				if (canEditOutline_) {
					thisFacilityEditor_.deleteFacilityOutline();
				}
			});

			// Create the filter to listen to all vertex updates for this facility.
			var data = {
				className:    codeshelf.domainobjects.vertex.classname,
				propertyNames:['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				filterClause: 'parentLocation.persistentId = :theId',
				filterParams: [
					{ name:"theId", value:facility_.persistentId}
				]
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

		},

		handleCreateVertexCmd:function (latLng, vertex) {

			var iconUrl = 'icons/marker_20_blue.png';

			if (vertex.DrawOrder === 0) {
				iconUrl = 'icons/marker_20_red.png';
			}

			facilityOutlinePath_.insertAt(vertex.DrawOrder, latLng);
			//facilityOutlinePath_.insertAt(facilityOutlinePath_.length, latLng);

			var markerImage = new google.maps.MarkerImage(
				iconUrl,
				new google.maps.Size(12, 20),
				new google.maps.Point(0, 0),
				new google.maps.Point(6, 19)
			);

			var marker = new google.maps.Marker({
				position: latLng,
				map:      map_,
				draggable:true,
				icon:     markerImage
			});

			var vertexData = {marker:marker, persistentId:vertex.persistentId};

			facilityOutlineVertices_.push(vertexData);
			marker.setTitle(vertex.DomainId);

			// Add a drag handler to the marker.
			google.maps.event.addListener(marker, 'dragend', function () {
					if (canEditOutline_) {
						for (var i = 0, I = facilityOutlineVertices_.length; i < I && facilityOutlineVertices_[i].marker != marker; ++i);
						facilityOutlinePath_.setAt(i, marker.getPosition());

						if (canEditOutline_) {
							var data = {
								className:   codeshelf.domainobjects.vertex.classname,
								persistentId:vertex.persistentId,
								properties:  [
									{name:'PosX', value:marker.getPosition().lng()},
									{name:'PosY', value:marker.getPosition().lat()}
								]
							}

							var moveVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
							websession_.sendCommand(moveVertexCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
						}
					}
				}
			);

			//  The vertex at DrawPos 0 goes to the anchor marker.
			if (vertex.DrawOrder === 0) {
				facilityAnchorMarker_ = marker;
				google.maps.event.addListener(facilityAnchorMarker_, goog.events.EventType.CLICK, function () {
						facilityOutline_.setMap(null);
						facilityOutline_ = new google.maps.Polygon({
							strokeWeight:3,
							strokeColor: '#ff0000',
							fillCOlor:   '#0000cc'
						});
						facilityOutline_.setMap(map_);
						facilityOutline_.setPath(facilityOutlinePath_);
					}
				);
			}

			//pen_.draw(event.latLng);


//						var projection = facilityEditorOverlay_.getProjection();
//						var clickPoint = projection.fromLatLngToContainerPixel(event.latLng);
//						for (var deg = 0; deg <= 360; deg += 10) {
//							var rotatePoint = thisFacilityEditor_.rotatePoint(clickPoint.x, clickPoint.y, mapPane_.clientWidth / 2, mapPane_.clientHeight / 2, deg);
//							newPoint = new google.maps.Point(rotatePoint.x, rotatePoint.y);
//							longLat = projection.fromContainerPixelToLatLng(newPoint, true);
//							pen_.draw(longLat);
//						}
		},

		handleUpdateVertexCmd:function (latLng, vertex) {
			// First see if the marker already exists.
			var existingLatLng = facilityOutlinePath_.getAt(vertex.DrawOrder);

			if (existingLatLng === undefined) {
				thisFacilityEditor_.handleCreateVertexCmd(latLng, vertex);
			} else {
				facilityOutlinePath_.setAt(vertex.DrawOrder, latLng);
				var vertexData = facilityOutlineVertices_[vertex.DrawOrder];
				vertexData.marker.setPosition(latLng);
			}

		},

		handleDeleteVertexCmd:function (latLng, vertex) {
			var vertexData = facilityOutlineVertices_[vertex.DrawOrder];

			if (vertexData !== undefined) {
				vertexData.marker.setMap(null);
				facilityOutlinePath_.setAt(vertex.DrawOrder, null);

				facilityOutlineVertices_[vertex.DrawOrder].marker.setMap(null);
				facilityOutlineVertices_[vertex.DrawOrder] = null;

				if (vertex.DrawOrder === 0) {
					facilityAnchorMarker_ = null;
				}
			}
		},

		deleteFacilityOutline:function () {
			// Clear all of the markers from the map.
			for (var i = 0; i < facilityOutlineVertices_.length; ++i) {

				var data = {
					className:   codeshelf.domainobjects.vertex.classname,
					persistentId:facilityOutlineVertices_[i].persistentId
				}

				var newVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_DELETE_REQ, data);
				websession_.sendCommand(newVertexCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_DELETE_RESP), false);
			}


//			facilityOutlinePath_.clear();
//			facilityOutlineVertices_.length = 0;
//			facilityAnchorMarker_ = null;
//
//			facilityOutline_ = new google.maps.Polyline({
//				strokeWeight:3,
//				strokeColor: '#ff0000',
//				fillCOlor:   '#0000cc'
//			});
//			facilityOutline_.setMap(map_);
//			facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));
		},

		rotatePoint:function (x, y, xm, ym, a) {
			var cos = Math.cos;
			var sin = Math.sin;

			// Convert to radians because that's what JavaScript likes
			var a = a * Math.PI / 180;

			// Subtract midpoints, so that midpoint is translated to origin and add it in the end again
			var xr = (x - xm) * cos(a) - (y - ym) * sin(a) + xm;
			var yr = (x - xm) * sin(a) + (y - ym) * cos(a) + ym;

			return {'x':xr, 'y':yr};
		},

		resizeFunction:function () {
			google.maps.event.trigger(mapPane_, 'resize');
		},

		exit:function () {
			pen_.deleteMis();
			if (pen_.polygon != null) {
				pen_.polygon.remove();
			}
			google.maps.event.removeListener(clickHandler_);
			google.maps.event.removeListener(doubleClickHandler_);
		},

		websocketCmdCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else {
						if (command.type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command.data.result.length; i++) {
								var object = command.data.result[i];

								// Make sure the class name matches.
								if (object.className === codeshelf.domainobjects.vertex.classname) {
									var latLng = new google.maps.LatLng(object.PosY, object.PosX);

									if (object.opType === 'create') {
										thisFacilityEditor_.handleCreateVertexCmd(latLng, object);
									} else if (object.opType === 'update') {
										thisFacilityEditor_.handleUpdateVertexCmd(latLng, object);
									} else if (object.opType === 'delete') {
										thisFacilityEditor_.handleDeleteVertexCmd(latLng, object);
									}
								}
							}
						} else if (command.type == kWebSessionCommandType.OBJECT_CREATE_RESP) {
//							var object = command.data.result;
//
//							// Make sure the class name matches.
//							if (object.className === codeshelf.domainobjects.vertex.classname) {
//								var latLng = new google.maps.LatLng(object.posY, object.posX);
//
//								thisFacilityEditor_.handleCreateVertexCmd(latLng, object);
//							}
						} else if (command.type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
//							var object = command.data.result;
//
//							// Make sure the class name matches.
//							if (object.className === codeshelf.domainobjects.vertex.classname) {
//								var latLng = new google.maps.LatLng(object.posY, object.posX);
//
//								thisFacilityEditor_.handleUpdateVertexCmd(latLng, object);
//							}
						} else if (command.type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
							var object = command.data.result;

							// Make sure the class name matches.
							if (object.className === codeshelf.domainobjects.vertex.classname) {
								var latLng = new google.maps.LatLng(object.posY, object.posX);

								thisFacilityEditor_.handleDeleteVertexCmd(latLng, object);
							}
						}
					}
				},
				getExpectedResponseType:function () {
					return expectedResponseType_;
				}
			}

			return callback;
		}
	}

	return thisFacilityEditor_;
}

/*
 * Child of Polygon class
 * Info Class
 */
codeshelf.facilityeditor.info = function (polygon, map) {
	var parent_ = polygon;
	var map_ = map;

	var color_ = document.createElement('input');

	var button_ = document.createElement('input');
	$(button_).attr('type', 'button');
	$(button_).val("Change Color");

	var thisInfo = {
		//change color action
		changeColor:function () {
			parent_.setColor($(thisOjb.color).val());
		},

		//get content
		getContent: function () {
			var content = document.createElement('div');

			$(color_).val(parent_.getColor());
			$(button_).click(function () {
				changeColor();
			});

			$(content).append(color_);
			$(content).append(button_);
			return content;
		},

		show:function (latLng) {
			infoWidObj_.setPosition(latLng);
			infoWidObj_.open(map_);
		},

		remove:function () {
			infoWidObj_.close();
		}
	}

	var infoWidObj_ = new google.maps.InfoWindow({
		content:thisInfo.getContent()
	});

	return thisInfo;
}
