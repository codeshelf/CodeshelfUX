/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: facilityEditor.js,v 1.27 2012/04/19 07:32:16 jeffw Exp $
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
	var pen_;
	var clickHandler_;
	var doubleClickHandler_;
	var clickTimeout_;
	var websession_;
	var organization_;
	var mapPane_;
	var mapRotatePane_;
	var thisFacilityEditor_;
	var facility_
	var facilityEditorOverlay_;
	var facilityOutlinePath_;
	var facilityOutlineMarkers_ = [];
	var facilityOutline_;
	var facilityAnchorMarker_ = null;

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
				fillColor:   '#5555FF'
			});
			facilityOutline_.setMap(map_);
			facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));

			clickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.CLICK, function (event) {
					clickTimeout_ = setTimeout(function () {

						facilityOutlinePath_.insertAt(facilityOutlinePath_.length, event.latLng);

						var iconUrl = 'icons/marker_20_blue.png';

						if (facilityOutlineMarkers_.length === 0) {
							iconUrl = 'icons/marker_20_red.png';
						}

						var markerImage = new google.maps.MarkerImage(
							iconUrl,
							new google.maps.Size(12, 20),
							new google.maps.Point(0, 0),
							new google.maps.Point(6, 16)
						);

						var marker = new google.maps.Marker({
							position: event.latLng,
							map:      map_,
							draggable:true,
							icon:     markerImage
						});

						facilityOutlineMarkers_.push(marker);
						marker.setTitle("#" + facilityOutlinePath_.length);

						google.maps.event.addListener(marker, 'dragend', function () {
								for (var i = 0, I = facilityOutlineMarkers_.length; i < I && facilityOutlineMarkers_[i] != marker; ++i);
								facilityOutlinePath_.setAt(i, marker.getPosition());
							}
						);

						if (facilityAnchorMarker_ === null) {
							facilityAnchorMarker_ = marker;
							google.maps.event.addListener(facilityAnchorMarker_, goog.events.EventType.CLICK, function () {
									facilityOutline_.setMap(null);
									facilityOutline_ = new google.maps.Polygon({
										strokeWeight:3,
										fillColor:   '#5555FF'
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
					}, 250);
				}
			)

			doubleClickHandler_ = google.maps.event.addListener(map_, goog.events.EventType.DBLCLICK, function (event) {
				clearTimeout(clickTimeout_);
				thisFacilityEditor_.deletePolyline();
			});

//			keyHandler_ = google.maps.event.addListener(map_, 'rightclick', function (event) {
//				mapRotatePane_.animate({rotate:'+=1deg'}, 0);
//			});

			var data = {
				className:    codeshelf.domainobjects.vertex.classname,
				propertyNames:['PosXMeters', 'PosYMeters', 'SortOrder'],
				filterClause: 'parentLocation.persistentId = :theId',
				filterParams: [
					{ name:"theId", value:facility_.persistentId}
				]
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, thisFacilityEditor_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

		},

		deletePolyline: function() {
			// Clear all of the markers from the map.
			for (var i = 0; i < facilityOutlineMarkers_.length; ++i) {
				facilityOutlineMarkers_[i].setMap(null);
			}

			facilityOutlinePath_.clear();
			facilityOutlineMarkers_.length = 0;
			facilityAnchorMarker_ = null;

			facilityOutline_ = new google.maps.Polyline({
				strokeWeight:3,
				fillColor:   '#5555FF'
			});
			facilityOutline_.setMap(map_);
			facilityOutline_.setPath(new google.maps.MVCArray([facilityOutlinePath_]));
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

		showData:function () {
			return pen_.getData();
		},

		showColor:function () {
			return pen_.getColor();
		},

		websocketCmdCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else {
						if (command.type == kWebSessionCommandType.OBJECT_GETTER_RESP) {
							for (var i = 0; i < command.data.result.length; i++) {
								var object = command.data.result[i];

								// Make sure the class name matches.
								if (object.className === codeshelf.domainobjects.facility.classnam) {

								}
							}
						} else if (command.type == kWebSessionCommandType.OBJECT_LISTENER_RESP) {

						} else if (command.type == kWebSessionCommandType.OBJECT_FILTER_RESP) {

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
 * pen class
 */
codeshelf.facilityeditor.pen = function (map) {

	var map_ = map;
	var listOfDots_ = new Array();
	var polyline_ = null;
	var polygon_ = null;
	var currentDot_ = null;

	var thisPen = {

		draw:function (latLng) {
			if (polygon_ != null) {
				alert('Click Reset to draw another');
			} else {
				// Figure out if we're clicking on an existing marker.
				if (currentDot_ != null && listOfDots_.length > 1 && currentDot_ == listOfDots_[0]) {
					this.drawPolygon(listOfDots_);
				} else {
					//remove previous line
					if (polyline_ != null) {
						polyline_.remove();
					}
					//draw Dot
					var dot = codeshelf.facilityeditor.dot(latLng, map_, this);
					listOfDots_.push(dot);
					//draw line
					if (listOfDots_.length > 1) {
						polyline_ = codeshelf.facilityeditor.line(listOfDots_, map_);
					}
				}
			}
		},

		drawPolygon:function (listOfDots, color, des, id) {
			polygon_ = codeshelf.facilityeditor.polygon(listOfDots, map, this, color, des, id);
			thisPen.deleteMis();
		},

		deleteMis:function () {
			//delete dots
			$.each(listOfDots_, function (index, value) {
				value.remove();
			});
			listOfDots_.length = 0;
			//delete lines
			if (polyline_ != null) {
				polyline_.remove();
				polyline_ = null;
			}
		},

		cancel:function () {
			if (polygon_ != null) {
				(polygon_.remove());
			}
			polygon_ = null;
			thisPen.deleteMis();
		},

		setCurrentDot:function (dot) {
			currentDot_ = dot;
		},

		getListOfDots:function () {
			return listOfDots_;
		},

		getData:function () {
			if (polygon_ != null) {
				var data = "";
				var paths = polygon_.getPlots();
				//get paths
				paths.getAt(0).forEach(function (value, index) {
					data += (value.toString());
				});
				return data;
			} else {
				return null;
			}
		},

		getColor:function () {
			if (polygon_ != null) {
				var color = polygon_.getColor();
				return color;
			} else {
				return null;
			}
		}
	}

	return thisPen;
}

/* Child of Pen class
 * dot class
 */
codeshelf.facilityeditor.dot = function (latLng, map, pen) {
	//property
	var latLng_ = latLng;
	var parent_ = pen;

	var markerImage = new google.maps.MarkerImage(
		'icons/marker_20_red.png',
		new google.maps.Size(12, 20),
		new google.maps.Point(0, 0),
		new google.maps.Point(6, 16)
	);

	var markerObj_ = new google.maps.Marker({
		position: latLng,
		map:      map,
		draggable:true,
		icon:     markerImage
	});

	var thisDot = {
		//getter
		getLatLng:function () {
			return latLng_;
		},

		getMarkerObj:function () {
			return markerObj_;
		},

		remove:function () {
			markerObj_.setMap(null);
		}
	}

	//closure
	addListener = function () {
		google.maps.event.addListener(markerObj_, 'click', function () {
			parent_.setCurrentDot(thisDot);
			parent_.draw(markerObj_.getPosition());
		});
	}
	addListener();

	google.maps.event.addListener(markerObj_, 'dragend', function () {
			for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
			path.setAt(i, marker.getPosition());
		}
	);

	return thisDot;

}

/* Child of Pen class
 * Line class
 */
codeshelf.facilityeditor.line = function (listOfDots, map) {
	var listOfDots_ = listOfDots;
	var map_ = map;
	var coords_ = new Array();
	var polylineObj_ = null;

	if (listOfDots_.length > 1) {
		$.each(listOfDots_, function (index, value) {
			coords_.push(value.getLatLng());
		});

		polylineObj_ = new google.maps.Polyline({
			path:         coords_,
			strokeColor:  "#FF0000",
			strokeOpacity:1.0,
			strokeWeight: 2,
			map:          map_
		});
	}

	return    {
		remove:function () {
			polylineObj_.setMap(null);
		}
	}
}

/* Child of Pen class
 * polygon class
 */
codeshelf.facilityeditor.polygon = function (listOfDots, map, pen, color) {
	listOfDots_ = listOfDots;
	map_ = map;
	coords_ = new Array();
	parent_ = pen;
	des_ = 'Hello';

	var thisPolygon = {
		remove:    function () {
			info_.remove();
			polygonObj_.setMap(null);
		},

		//getter
		getContent:function () {
			return des_;
		},

		getPolygonObj:function () {
			return polygonObj_;
		},

		getListOfDots:function () {
			return listOfDots_;
		},

		getPlots:function () {
			return polygonObj_.getPaths();
		},

		getColor:function () {
			return polygonObj_.fillColor;
		},

		//setter
		setColor:function (color) {
			return polygonObj_.setOptions(
				{fillColor:      color,
					strokeColor: color,
					strokeWeight:2
				}
			);
		}
	}

	$.each(listOfDots_, function (index, value) {
		coords_.push(value.getLatLng());
	});

	polygonObj_ = new google.maps.Polygon({
		paths:        coords_,
		strokeColor:  "#FF0000",
		strokeOpacity:0.8,
		strokeWeight: 2,
		fillColor:    "#FF0000",
		fillOpacity:  0.35,
		map:          map_
	});

	var info = codeshelf.facilityeditor.info(thisPolygon, map_);

	//closure
	addListener = function () {
		var thisPolygon = polygonObj_;
		var info_ = info;
		google.maps.event.addListener(thisPolygon, 'rightclick', function (event) {
			info_.show(event.latLng);
		});
	}
	addListener();

	return thisPolygon;
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
