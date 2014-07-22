goog.require('codeshelf.chelistview');
goog.require('goog.array');

describe('cheListView', function() {
	var websession, jqPane, pane;

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand']);
		jqPane = $("<div/>");
		pane = jqPane.get(0);
	});

	it("initialize view", function() {
		var listview = codeshelf.cheslistview(websession, {});
		listview.setupView(pane);
		expect(getRenderedColumns().size()).toEqual(6);
	});

	var getRenderedColumns = function() {
		return jqPane.find(".slick-header-column");
	};

});
