goog.provide("codeshelf.pathtool");

goog.require('extern.jquery');
goog.require('bacon');

function Path(pathDomainId, pixelToMeters) {
	this['direction'] = "FORWARD";
	this['domainId'] = pathDomainId;
	this.segments= [];
	this.segmentIndex = 0;
	this.addSegment = function(lineSegment) {
		var segment = {};
		segment['segmentOrder'] = this.segmentIndex++;
		segment['domainId'] = pathDomainId + "." + segment['segmentOrder'];
		segment['posTypeEnum'] = "METERS_FROM_PARENT";
		segment['startPosX'] = pixelToMeters(lineSegment.startPoint.x);
		segment['startPosY'] = pixelToMeters(lineSegment.startPoint.y);
		segment['endPosX'] = pixelToMeters(lineSegment.endPoint.x);
		segment['endPosY'] = pixelToMeters(lineSegment.endPoint.y);
		this.segments.push(segment);
	};
}

function PathTool (canvas, createPath) {
	var clicks  = $(canvas).asEventStream("click");
	//ESCs are only captured by documents and  inputs
	var ESCs = $(document).asEventStream('keydown').map(".keyCode").filter(27).log();
	var startPaths = Bacon.once({}).merge(ESCs);
	var endPaths = ESCs;

	this.newSegments = startPaths.flatMap(function(newPathEvent) {
		return captureNewSegments().takeUntil(endPaths);
	});

	this.newPaths = startPaths.flatMap(function(newPathEvent) {
		var newPath = createPath();
		//fold captured segments into a  path
	    return captureNewSegments().takeUntil(endPaths).fold(newPath, function(path, lineSegment){

            path.addSegment(lineSegment);
	        return path;
	    });
	});

	function captureNewSegments() {
		var newSegments = onEvery(2, clicks).map(toALineSegment);
		return newSegments;
	}

	function onEvery(num, stream) {
	   return stream.slidingWindow(num).skip(num);
	}

	function convertClickToPoint (click){
		return  {
			x: click['offsetX'],
			y: click['offsetY']
		};
	}

	function toALineSegment(clickPair){
		var lineSegment =  {
			startPoint: convertClickToPoint(clickPair[0]),
			endPoint: convertClickToPoint(clickPair[1])
		};
		return lineSegment;
	}
}
