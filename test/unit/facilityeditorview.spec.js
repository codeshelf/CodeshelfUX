//'use strict';

goog.require('codeshelf.facilityeditorview');

/* BDD Form:
 Story: Make a facility
 In order to... create a facility
 As a... system installer or tester
 I want to... create a facility, set its position and outline.
 */

/* BDD Scenario 1 (remember, no UI in BDD)
 Scenario 1: Make a new facility
 Given... System is up. And brand new, or database was just dropped.
 When... user makes a new facility
 Then... the result is a usable facility.
 */

/* BDD Scenario 2: modify facility outline
 Given... facility is there
 When... user adds or deletes outline points
 Then... the facility is updated.
 */


/* jasmine specs for controllers go here */
describe('Codeshelf facility editor', function() {
	var jqPane, pane;

	/* Run before each describe and it function */
	beforeEach(function(){
		jqPane = $("<div/>");
		pane = jqPane.get(0);

		$(document.body).append(jqPane);


	});

	afterEach(function() {
		jqPane.remove();
		jqPane = null;
	});

	it("creates new facility outline", function() {
		var newFacility;

		/*
		pathtool.newPaths.onValue(function(path) {
			newPath = path;
		});
		*/

		/*
		clickAt(pane, 10,10);
		clickAt(pane, 10,100);
		clickAt(pane, 100,100);
		clickAt(pane, 100,10);
		*/

		// just a stub to show the test is running

		expect(true).toEqual(true);

		


		});




});


function drawOddFacility(pane) {
	clickAt(pane, 10,10);
	clickAt(pane, 10,100);
	// keyDown(27);
	clickAt(pane, 100,100);
	clickAt(pane, 100,10);
	// should have closed the region

	// add odd vertices
	clickAt(pane, 70,130);
	//keyDown(27);
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
