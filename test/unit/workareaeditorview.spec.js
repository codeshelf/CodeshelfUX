//'use strict';

goog.require('codeshelf.workareaeditorview');

/* jasmine specs for controllers go here */
describe('Codeshelf workareaeditorview', function() {
	var workareaeditorview;
	var jqPane, pane;

	/* Run before each describe and it function */
	beforeEach(function(){
		jqPane = $("<div/>");
		pane = jqPane.get(0);

		$(document.body).append(jqPane);
		workareaeditorview = codeshelf.workareaeditorview({},{},{});
		workareaeditorview.setupView(pane);
	});

	afterEach(function() {
		jqPane.remove();
		jqPane = null;
	});


/*
	it('can set toolbar tool programmatically', function() {
		workareaeditorview.setToolbarTool('path-tool');
		expect(workareaeditorview.isToolbarTool('path-tool')).toBe(true);

		workareaeditorview.setToolbarTool('select-tool');
		expect(workareaeditorview.isToolbarTool('select-tool')).toBe(true);

	});

	describe('given select tool chosen', function(){
		beforeEach(function() {
			workareaeditorview.setToolbarTool('select-tool');
			expect(workareaeditorview.isToolbarTool('select-tool')).toBe(true);

		});

		it("it receives mouse clicks", function() {
			testMouseClick(workareaeditorview);
		});
	});
	describe('given path tool chosen', function(){
		beforeEach(function() {
			workareaeditorview.setToolbarTool('path-tool');
			expect(workareaeditorview.isToolbarTool('path-tool')).toBe(true);
		});

		it("it receives mouse clicks", function() {
			testMouseClick(workareaeditorview);
		});

		it("it receives esc key", function() {

			var editTool = workareaeditorview.getEditTool();
			spyOn(editTool, 'doKeyDown');

			var keypress = new goog.events.Event(goog.events.EventType.KEYDOWN, {});
			goog.events.fireListeners(document, goog.events.EventType.KEYDOWN, false, keypress);

			expect(editTool.doKeyDown).toHaveBeenCalled();

		});


	});

	function testMouseClick(workareaeditorview) {
			var contentElement = workareaeditorview.getContentElement();
			var editTool = workareaeditorview.getEditTool();
			spyOn(editTool, 'doMouseClick');


			expect(goog.events.getListeners(contentElement, goog.events.EventType.CLICK, false).length).toBeGreaterThan(0);
			var click = new goog.events.Event(goog.events.EventType.CLICK, {});


			goog.events.fireListeners(contentElement, goog.events.EventType.CLICK, false, click);

			expect(editTool.doMouseClick).toHaveBeenCalled();

	}
*/
});
