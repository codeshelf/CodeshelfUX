/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditor.js,v 1.39 2012/04/26 09:32:55 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.facilityeditor');
goog.require('codeshelf.templates');
goog.require('codeshelf.facilityeditorgmapsoverlay');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.dataobjectfield');
goog.require('goog.dom.query');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('jquery.css-rotate');
goog.require('jquery.css-transform');


var newPoint;
var longLat;
var rotateDeg = 0;

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
	var facilityBounds_;
	var facilityEditorOverlay_;
	var facilityOutlinePath_;
	var facilityOutlineVertices_ = [];
	var facilityOutline_;
	var facilityAnchorMarker_ = undefined;
	var canEditOutline_ = true;
	var localUserCreatedMarker_ = false;
	var geocoder_;
	var geocoderTextField_;
	var googleField_;

	var infoWindow_ = new google.maps.InfoWindow();
	var totalBounds_ = new google.maps.LatLngBounds();
	var overlays_ = [];

	thisFacilityEditor_ = {
		start:function (websession, organization, parentFrame, facility) {

			websession_ = websession;
			facility_ = facility;
			organization_ = organization;

			// Starting latlng is either the facility's origin point or the browser's current location (if we can get it).
			var demoLatLng = new google.maps.LatLng(facility_.posY, facility_.posX);
			var myOptions = {
				zoom:                  16,
				center:                demoLatLng,
				mapTypeId:             google.maps.MapTypeId.ROADMAP,
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

			// Setup GMaps geocoding to locate places for the user (if needed).
			geocoder_ = new google.maps.Geocoder();
			geocoder_.responseIndex = 0;
			geocoder_.responseSet = [];

//			geocoderTextField_ = goog.dom.query('#geocoderText', editorPane)[0];
//			geocoderTextField_.onkeydown = function (event) {
//				if (event.keyCode == 13) {
//					geocoder_.geocode({'address':geocoderTextField_.value}, thisFacilityEditor_.computeGeoCodeResults);
//				}
//			}
//			geocoderTextField_.focus();
//			geocoderTextField_.select();


			var fieldId = goog.events.getUniqueId('search');
			var inputElement_ = soy.renderAsElement(codeshelf.templates.dataObjectField, {name:'name', id:fieldId, title:'title'});
			goog.dom.appendChild(contentPane, inputElement_);
			googleField_ = new goog.editor.SeamlessField(fieldId);
			googleField_.makeEditable();

			goog.events.listen(googleField_, goog.editor.Field.EventType.BLUR, function (event) {
				var contents = googleField_.getCleanContents();
				geocoder_.geocode({'address':contents}, thisFacilityEditor_.computeGeoCodeResults);
			});

			// Add the graphical editor.
			var editorPane = soy.renderAsElement(codeshelf.templates.facilityEditor);
			goog.dom.appendChild(contentPane, editorPane);
			mapPane_ = goog.dom.query('.facilityMap', editorPane)[0];
			map_ = new google.maps.Map(mapPane_, myOptions);
			facilityEditorOverlay_ = codeshelf.facilityeditorgmapsoverlay(map_);

			clickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.CLICK, function (event) {
					clickTimeout_ = setTimeout(function () {

						if (canEditOutline_) {
							// We need to make sure the strucgtures get created before we set the user create marker.
							localUserCreatedMarker_ = true;
							thisFacilityEditor_.ensureOutlineStructures();

							var vertexNum = thisFacilityEditor_.getNextVertexNum();
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

							// If this was the anchor vertex then set the location of the facility as well.
							var data = {
								className:   codeshelf.domainobjects.facility.classname,
								persistentId:facility_.persistentId,
								properties:  [
									{name:'PosTypeByStr', value:'GPS'},
									{name:'PosX', value:event.latLng.lng()},
									{name:'PosY', value:event.latLng.lat()}
								]
							}
							var moveVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
							websession_.sendCommand(moveVertexCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
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

		ensureOutlineStructures:function () {
			if (facilityOutlinePath_ === undefined) {

				facilityBounds_ = undefined;

				// Setup the outline management for the facility.
				facilityOutlinePath_ = new google.maps.MVCArray;
				if (localUserCreatedMarker_ === true) {
					facilityOutline_ = new google.maps.Polyline({
						strokeWeight:3,
						strokeColor: '#ff0000',
						fillColor:   '#0000cc'
					});
				} else {
					facilityOutline_ = new google.maps.Polygon({
						strokeWeight:3,
						strokeColor: '#ff0000',
						fillCOlor:   '#0000cc'
					});
				}

				facilityOutline_.setMap(map_);
				facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));
			}
		},

		getNextVertexNum:function () {
			// The vertex number if the count of the valid vertices so far.
			var vertexNum = 0;
			for (var i = 0; i < facilityOutlineVertices_.length; i++) {
				if ((facilityOutlineVertices_[i] !== null ) && (facilityOutlineVertices_[i] !== undefined )) {
					vertexNum++;
				}
			}
			return vertexNum;
		},

		handleCreateVertexCmd:function (latLng, vertex) {

			thisFacilityEditor_.ensureOutlineStructures();
			facilityOutlinePath_.setAt(vertex.DrawOrder, latLng);
			facilityOutline_.setVisible(true);

			// The case where we're adding a new marker (maybe even the anchor marker) that we must show.
			var iconUrl = 'icons/marker_20_blue.png';
			if (vertex.DrawOrder === 0) {
				iconUrl = 'icons/marker_20_red.png';
			}

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

			var vertexData = {marker:marker, vertex:vertex};
			facilityOutlineVertices_[vertex.DrawOrder] = vertexData;
			marker.setTitle(vertex.DomainId);

			// Add a drag handler to the marker.
			google.maps.event.addListener(marker, 'dragend', function () {
					if (canEditOutline_) {
						facilityOutlinePath_.setAt(vertexData.vertex.DrawOrder, marker.getPosition());

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
			)
//			}

			//  The vertex at DrawPos 0 goes to the anchor marker.
			if (vertex.DrawOrder === 0) {
				facilityAnchorMarker_ = marker;
				// If the user clicks on the anchor marker then create a final marker on top of the anchor, and prevent further markers.
				// When the update returns this will close the polyline into a polygon.
				google.maps.event.addListener(facilityAnchorMarker_, goog.events.EventType.CLICK, function () {
						if (canEditOutline_) {
							facilityOutline_.setMap(null);
							thisFacilityEditor_.completePolygon();
						}
					}
				)
			}

			thisFacilityEditor_.setBounds();

//						var clickPoint = projection.fromLatLngToContainerPixel(event.latLng);
//						for (var deg = 0; deg <= 360; deg += 10) {
//							var rotatePoint = thisFacilityEditor_.rotatePoint(clickPoint.x, clickPoint.y, mapPane_.clientWidth / 2, mapPane_.clientHeight / 2, deg);
//							newPoint = new google.maps.Point(rotatePoint.x, rotatePoint.y);
//							longLat = projection.fromContainerPixelToLatLng(newPoint, true);
//							pen_.draw(longLat);
//						}
		},

		handleUpdateVertexCmd:function (latLng, vertex) {
			if ((facilityOutlinePath_ === undefined) || (facilityOutlinePath_.getAt(vertex.DrawOrder) === undefined)) {
				// If the outline or marker don't exist then create them.
				thisFacilityEditor_.handleCreateVertexCmd(latLng, vertex);
			} else {
				// The outline and marker exist, so update the  marker.
				facilityOutlinePath_.setAt(vertex.DrawOrder, latLng);
				var vertexData = facilityOutlineVertices_[vertex.DrawOrder];
				vertexData.marker.setPosition(latLng);
			}
			thisFacilityEditor_.setBounds();
		},

		handleDeleteVertexCmd:function (latLng, vertex) {
			var vertexData = facilityOutlineVertices_[vertex.DrawOrder];
			facilityOutlineVertices_[vertex.DrawOrder] = undefined;

			if (vertexData !== undefined) {
				vertexData.marker.setMap(null);
				facilityOutlinePath_.setAt(vertex.DrawOrder, undefined);

				if (vertex.DrawOrder === 0) {
					facilityAnchorMarker_ = undefined;
				}
			}

			// If we've deleted all of the vertices then we need to re-init the outline structures.
			// (Seems like an error in GMaps)
			var shouldInit = true;
			for (var i = 0; i < facilityOutlinePath_.length; i++) {
				if (facilityOutlinePath_.getAt(i) !== undefined) {
					shouldInit = false;
				}
			}
			if (shouldInit) {
				facilityOutlinePath_ = undefined;
				//localUserCreatedMarker_ = false;
				thisFacilityEditor_.ensureOutlineStructures();
			}
		},

		deleteFacilityOutline:function () {
			// Clear all of the markers from the map.
			for (var i = 0; i < facilityOutlineVertices_.length; ++i) {

				var data = {
					className:   codeshelf.domainobjects.vertex.classname,
					persistentId:facilityOutlineVertices_[i].vertex.persistentId
				}

				var newVertexCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_DELETE_REQ, data);
				websession_.sendCommand(newVertexCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_DELETE_RESP), false);
			}
		},

		completePolygon:function () {
			// First make the outline into a polygon.
			facilityOutline_ = new google.maps.Polygon({
				strokeWeight:3,
				strokeColor: '#ff0000',
				fillCOlor:   '#0000cc'
			});
			facilityOutline_.setMap(map_);
			facilityOutline_.setPath(facilityOutlinePath_);

			// Now make the second and last markers green.
			var iconUrl = 'icons/marker_20_green.png';
			var markerImage = new google.maps.MarkerImage(
				iconUrl,
				new google.maps.Size(12, 20),
				new google.maps.Point(0, 0),
				new google.maps.Point(6, 19)
			);

			// The thing we need to rotate in GMaps is a map-div layer that's two layers down.
			// Warning: this is a hack discovered by hacking into GMaps.
			//mapRotatePane_ = mapRotatePane_[0].firstChild.firstChild;
			mapRotatePane_ = $('.facilityMap > div:first-child > div:first-child');
			mapRotatePane_[0].style.overflow = "visible";

			// Setup green rotate marker #1.
			var marker1 = facilityOutlineVertices_[1].marker;
			var bearing1 = 90 - google.maps.geometry.spherical.computeHeading(facilityAnchorMarker_.getPosition(), marker1.getPosition());
			//var bearing1 = -1 * thisFacilityEditor_.bearing(facilityAnchorMarker_.getPosition(), marker1.getPosition()) / 2;
			marker1.setIcon(markerImage);
			google.maps.event.addListener(marker1, goog.events.EventType.CLICK, function () {
					if (canEditOutline_) {
						map_.setCenter(facilityAnchorMarker_.getPosition());
						mapRotatePane_.animate({rotate:bearing1 + 'deg'});
						thisFacilityEditor_.setBounds();
					}
				}
			)

			// Setup green rotate marker #2.
			var marker2 = facilityOutlineVertices_[facilityOutlineVertices_.length - 1].marker;
			var bearing2 = 90 - google.maps.geometry.spherical.computeHeading(facilityAnchorMarker_.getPosition(), marker2.getPosition());
			//var bearing2 = thisFacilityEditor_.bearing(facilityAnchorMarker_.getPosition(), marker2.getPosition()) / 2;
			marker2.setIcon(markerImage);
			google.maps.event.addListener(marker2, goog.events.EventType.CLICK, function () {
					if (canEditOutline_) {
						map_.setCenter(facilityAnchorMarker_.getPosition());
						mapRotatePane_.animate({rotate:bearing2 + 'deg'});
						thisFacilityEditor_.setBounds();
					}
				}
			)
		},

		computeGeoCodeResults:function (response, status) {
			if (status == google.maps.GeocoderStatus.OK && response[0]) {
				// we save them all
				geocoder_.responseSet.push(response);
				thisFacilityEditor_.showGeocodeResult(0, geocoder_.responseIndex);
				geocoder_.responseIndex++;
			}
		},

		showGeocodeResult:function (ind, setIndex) {
			var results = geocoder_.responseSet[setIndex];
			var box = results[ind].geometry.bounds;
			var color = "#0000ff";
			if (!box) {
				color = "#ff0000";
				box = results[ind].geometry.viewport;
			}
			var html = "No address";
			if (results[ind].address_components[0]) {
				html = results[ind].address_components[0].long_name;
			}
			var overlay = new google.maps.Rectangle({
				map:        map_,
				bounds:     box,
				strokeColor:color,
				fillColor:  color,
				visible:    false
			});
			overlays_.push(overlay);
			map_.fitBounds(box);
			totalBounds_.union(box);

			// Save that next geocode won't overwrite.
			overlay.setIndex = setIndex;
			if (results.length > 1) {
				for (var i = 0; i < results.length; i++) {
					results[i].id = 'addr' + i;
				}
					var mapSearchItems = soy.renderAsElement((function () {
					var ind_ = ind;
					return function () {
						return    codeshelf.templates.gmapsAddrSearchInfoPopup({searchAddress:results[ind_].formatted_address, resultAddresses:results});
					}
				})());

				for (var i = 0; i < results.length; i++) {

					var selectorId = '> #' + results[i].id;
					var addrElement = goog.dom.query(selectorId, mapSearchItems);
					if (addrElement.length > 0) {
						addrElement[0].onclick = (function () {
							var thisOverlay_ = overlay;
							var index_ = i;
							return function () {
								thisFacilityEditor_.showGeocodeResult(index_, thisOverlay_.setIndex);
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

		setBounds:function () {
			if (facilityOutlineVertices_.length > 2) {
				// Figure out a new bounds for the facility outline.
				if (facilityBounds_ === undefined) {
					facilityBounds_ = new google.maps.LatLngBounds();
				}
				for (var i = 0; i < facilityOutlineVertices_.length; i++) {
					var latLng = facilityOutlineVertices_[i].marker.getPosition();
					facilityBounds_.extend(latLng);
				}
				map_.fitBounds(facilityBounds_);
				//map_.setCenter(facilityAnchorMarker_.getPosition());
			}
		},

		resizeFunction:function () {
			facilityBounds_ = undefined;
			google.maps.event.trigger(mapPane_, 'resize');
			thisFacilityEditor_.setBounds();
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
						} else if (command.type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
						} else if (command.type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
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
