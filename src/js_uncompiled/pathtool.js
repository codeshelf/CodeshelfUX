goog.provide("codeshelf.pathtool");

goog.require('extern.jquery');
goog.require('bacon');

function PathTool (canvas) {
	var clicks  = $(canvas).asEventStream("click");
	var ESCs = $(document).asEventStream('keydown').map(".keyCode").filter(27);
	var startPaths = Bacon.once(createPath()).merge(ESCs.map(createPath));
	var endPaths = ESCs;

	var newSegments = startPaths.flatMap(function(newPath) {
		return captureNewSegments().takeUntil(endPaths);
	});
	var newPaths = startPaths.flatMap(function(newPath) {
		//functional reduce captured segments by adding them to the given initial path
	    return captureNewSegments().takeUntil(endPaths).fold(newPath, function(path, segment){
            path.segments.push(segment);
	        return path;
	    });
	});
	this.newSegments = newSegments;
	this.newPaths = newPaths;

	function captureNewSegments() {
		var newSegments = onEvery(2, clicks).map(toASegment);
		return newSegments;
	}

	function createPath() {
		return {
			direction: "FORWARD",
			segments: []
		};
	}

	function onEvery(num, stream) {
	   return stream.slidingWindow(num).skip(num);
	}

	function toAPoint(click) {
		return  {x: click['offsetX'],
				 y: click['offsetY']};
	}

	function toASegment(clickPair){
			var start = toAPoint(clickPair[0]);
			var end = toAPoint(clickPair[1]);
			var segment =  {
				startPoint: start,
				endPoint: end
			};
			return segment;
	}




}
