goog.provide('codeshelf.facilityeditor');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

codeshelf.facilityeditor = function () {

	var map_;
	var pen_;
	var clickHandler_;
	var doubleClickHandler_;
	var clickTimeout_;
	var application_;
	var mapPane_;

	return {
		start:function (application, parentFrame) {

			application_ = application;

			var organization = application_.getOrganization();

			var data = {
				class:       organization.className,
				persistentId:organization.persistentId,
				getterMethod:'getFacilities'
			}

			var websession = application_.getWebsession();
			var getFacilitiesCmd = websession.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			websession.sendCommand(getFacilitiesCmd, codeshelf.facilityeditor.webSessionCommandCallback);

			// Safeway DC Tracy, CA
			var demoLatLng = new google.maps.LatLng(37.717198, -121.517029);
			var myOptions = {
				zoom:                  16,
				center:                demoLatLng,
				mapTypeId:             google.maps.MapTypeId.HYBRID,
				disableDoubleClickZoom:true,
				panControl:            false,
				rotateControl:         true,
				streetViewControl:     false
			}

			//map_ = new google.maps.Map(goog.dom.query('#facility_map')[0], myOptions);
			var editorWindow = codeshelf.window();
			editorWindow.init("Facility Editor", parentFrame, undefined, this.resizeFunction);
			editorWindow.open();
			var content = editorWindow.getContentElement();

			var innerPane = soy.renderAsElement(codeshelf.templates.facilityEditor);
			goog.dom.appendChild(content, innerPane);
			mapPane_ = goog.dom.query('.facilityMap', innerPane)[0];
			map_ = new google.maps.Map(mapPane_, myOptions);
			pen_ = codeshelf.facilityeditor.pen(map_);

			clickHandler_ = google.maps.event.addListener(map_, 'click', function (event) {
				clickTimeout_ = setTimeout(function () {
					pen_.draw(event.latLng);
				}, 250);
			});

			doubleClickHandler_ = google.maps.event.addListener(map_, 'dblclick', function (event) {
				clearTimeout(clickTimeout_);
				pen_.draw(pen_.getListOfDots()[0].getLatLng());
			});
		},

		resizeFunction:function () {
			google.maps.event.trigger(mapPane_, 'resize');
		},

		exit:function () {
			pen_.deleteMis();
			if (null != pen_.polygon) {
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
		}
	}
}

codeshelf.facilityeditor.webSessionCommandCallback = function (command) {
	if (!command.hasOwnProperty('type')) {
		alert('response has no type');
	} else {
		if (!command.type == codeshelf.websession.OBJECT_GETTER_RESP) {
			alert('response wrong type');
		} else {
			if (!command.hasOwnProperty('data')) {
				alert('reponse has no data');
			} else {
				if (!command.data.hasOwnProperty('result')) {
					alert('response has no result');
				} else {
					for (var i = 0; i < command.data.result.length; i++) {
						var object = command.data.result[i];
						alert("Object: " + object.className + " " + object.description);
					}
				}
			}
		}
	}
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
		//draw function
		draw:         function (latLng) {
			if (null != polygon_) {
				alert('Click Reset to draw another');
			} else {
				if (currentDot_ != null && listOfDots_.length > 1 && currentDot_ == listOfDots_[0]) {
					this.drawPolygon(listOfDots_);
				} else {
					//remove previous line
					if (null != polyline_) {
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
		//draw ploygon
		drawPolygon:  function (listOfDots, color, des, id) {
			polygon_ = codeshelf.facilityeditor.polygon(listOfDots, map, this, color, des, id);
			thisPen.deleteMis();
		},
		//delete all dots and polylines
		deleteMis:    function () {
			//delete dots
			$.each(listOfDots_, function (index, value) {
				value.remove();
			});
			listOfDots_.length = 0;
			//delete lines
			if (null != polyline_) {
				polyline_.remove();
				polyline_ = null;
			}
		},
		//cancel
		cancel:       function () {
			if (null != polygon_) {
				(polygon_.remove());
			}
			polygon_ = null;
			thisPen.deleteMis();
		},
		//setter
		setCurrentDot:function (dot) {
			currentDot_ = dot;
		},
		//getter
		getListOfDots:function () {
			return listOfDots_;
		},
		//get plots data
		getData:      function () {
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
		//get color
		getColor:     function () {
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
	var markerObj_ = new google.maps.Marker({
		position:latLng,
		map:     map
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

	return	{
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
