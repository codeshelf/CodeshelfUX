//'use strict';

goog.require('codeshelf.pathtool');

/* jasmine specs for controllers go here */
describe('Codeshelf pathdrawing', function() {
	var jqPane, pane, pathtool;

	/* Run before each describe and it function */
	beforeEach(function(){
		jqPane = $("<div/>");
		pane = jqPane.get(0);

		$(document.body).append(jqPane);

		var addSegment  = jasmine.createSpy('addSegment');
		pathtool = new PathTool(pane,
			function() { return new Path('testprefix', function(pixel) {return pixel;});}
		);
	});

	afterEach(function() {
		jqPane.remove();
		jqPane = null;
	});

	it("produces path after clicks and ESC", function() {
		var newPath;
		pathtool.newPaths.onValue(function(path) {
			newPath = path;
		});

		clickAt(pane, 0,0);
		clickAt(pane, 0,5);
		clickAt(pane, 0,10);
		keyDown(27);
		expect(newPath.segments.length).toEqual(2);
		expect(newPath.segments[0].startPosX).toEqual(0);
		expect(newPath.segments[0].startPosY).toEqual(0);
		expect(newPath.segments[0].endPosX).toEqual(0);
		expect(newPath.segments[0].endPosY).toEqual(5);
	});

	it("produces segments on clicks", function() {
		var lastLineSegment;
		pathtool.newSegments.onValue(function(segment) {
			lastLineSegment = segment;
		});

		clickAt(pane, 0,0);
		clickAt(pane, 0,5);
		expect(lastLineSegment.startPoint).toEqual({x:0, y:0, z:0});
		expect(lastLineSegment.endPoint).toEqual({x:0, y:5, z:0});

		clickAt(pane, 0,10);
		expect(lastLineSegment.startPoint).toEqual({x:0, y:5, z:0});
		expect(lastLineSegment.endPoint).toEqual({x:0, y:10, z:0});

	});


	it("produces multiple paths", function(){
		var savedPaths = [];
		Bacon.once(new Bacon.Error("fail")).delay(2000).endOnError().merge(pathtool.newPaths).onValue(function(path){
			savedPaths.push(path);
		});

		drawMultiplePaths(pane);
		expect(savedPaths.length).toEqual(2);
	});

	it("produces multiple sets of segments", function(){
		var savedSegments = [];
		Bacon.once(new Bacon.Error("fail")).delay(2000).endOnError()
			.merge(pathtool.newSegments).onValue(function(segments){
				savedSegments.push(segments);
			});

		drawMultiplePaths(pane);
		expect(savedSegments.length).toEqual(3);
	});


});


function drawMultiplePaths(pane) {
	clickAt(pane, 1,2);
	clickAt(pane, 1,5);
	keyDown(27);

	clickAt(pane, 1,10);
	clickAt(pane, 1,20);
	clickAt(pane, 1,30);
	keyDown(27);
}

function keyDown(keyCode) {
	$(document).trigger("keydown", createKeyDown(document, keyCode));
}

function clickAt(pane, offsetX, offsetY) {
	$(pane).trigger(createClick(pane, offsetX, offsetY));
//	pane.dispatchEvent(createClick(pane, offsetX, offsetY));
	//goog.events.dispatchEvent(pane, createClick(offsetX,offsetY));
}

function createClick(pane, offsetX, offsetY) {
	return jQuery.Event( "click" ,{offsetX: offsetX, offsetY:offsetY});
	//var evt = document.createEvent('MouseEvents');
	//evt.initEvent('click', true, false);
	//return new goog.events.BrowserEvent(evt, pane);
}

function createKeyDown(document, keyCode) {
	return jQuery.Event( "keydown" ,{keyCode: keyCode});
}
