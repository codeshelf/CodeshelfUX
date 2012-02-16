goog.provide('codeshelf.facilityeditor');
goog.require('codeshelf.templates');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

codeshelf.facilityeditor = function () {

	var map_;
	var pen_;
	var clickHandler_;
	var doubleClickHandler_;
	var clickTimeout_;

	return {
		start:function () {
			// Safeway DC Tracy, CA
			var demoLatLng = new google.maps.LatLng(37.717198, -121.517029);
			var myOptions = {
				zoom:                  16,
				center:                demoLatLng,
				mapTypeId:             google.maps.MapTypeId.HYBRID,
				disableDoubleClickZoom:true
			}
			map_ = new google.maps.Map(goog.dom.query('#facility_map')[0], myOptions);
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

/*
 * pen class
 */
codeshelf.facilityeditor.pen = function (map) {

	map_ = map;
	listOfDots_ = new Array();
	polyline_ = null;
	polygon_ = null;
	currentDot_ = null;

	return {
		//draw function
		draw:         function (latLng) {
			if (null != polygon_) {
				alert('Click Reset to draw another');
			} else {
				if (currentDot_ != null && listOfDots_.length > 1 && currentDot_ == listOfDots_[0]) {
					drawPloygon(listOfDots_);
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
		drawPloygon:  function (listOfDots, color, des, id) {
			polygon_ = codeshelf.facilityeditor.polygon(listOfDots, map, this, color, des, id);
			deleteMis();
		},
		//delete all dots and polylines
		deleteMis:    function () {
			//delete dots
			$.each(listOfDots, function (index, value) {
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
			deleteMis();
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

	//closure
	addListener = function () {
		var parent = parent_;
		var thisMarker = markerObj_;
		var thisDot = this;
		google.maps.event.addListener(thisMarker, 'click', function () {
			parent_.setCurrentDot(thisDot);
			parent_.draw(thisMarker.getPosition());
		});
	}
	addListener();

	return {
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


	var thisObj = this;
	$.each(listOfDots_, function (index, value) {
		thisObj.coords.push(value.getLatLng());
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

	info = codeshelf.facilityeditor.info(this, map_);

	//closure
	addListener = function () {
		var info = info_;
		var thisPolygon = polygonObj_;
		google.maps.event.addListener(thisPolygon, 'rightclick', function (event) {
			info.show(event.latLng);
		});
	}
	addListener();

	return {
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
			return getPolygonObj().fillColor;
		},

//setter
		setColor:function (color) {
			return getPolygonObj().setOptions(
				{fillColor:      color,
					strokeColor: color,
					strokeWeight:2
				}
			);
		}
	}
}

/*
 * Child of Polygon class
 * Info Class
 */
codeshelf.facilityeditor.info = function (polygon, map) {
	var parent_ = polygon;
	var map_ = map;

	var color = document.createElement('input');

	var button = document.createElement('input');
	$(button).attr('type', 'button');
	$(button).val("Change Color");

	var infoWidObj_ = new google.maps.InfoWindow({
		content:thisObj.getContent()
	});

	return {
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
}

codeshelf.facilityeditor.startEditor = function () {
	var facilityEditor = codeshelf.facilityeditor();
	facilityEditor.start();
}