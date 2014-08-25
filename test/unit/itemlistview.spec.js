goog.require('codeshelf.itemlistview');
goog.require('goog.array');
goog.require('codeshelf.authz');
describe('cheListView', function() {
	var websession, jqPane, pane;

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand', 'createRegisterFilterRequest']);
		websession['getAuthz'] = function() {
			return new codeshelf.Authz();
		};
		jqPane = $("<div/>");
		pane = jqPane.get(0);
	});

	it("initialize view for all", function() {
		var listview = codeshelf.itemlistview(websession, {});
		listview.setupView(pane);
		expect(getRenderedColumns().size()).toBeGreaterThan(1);
	});

	it("initialize view for all", function() {
		var facility = {};
		var aTier = {};

		var listview = codeshelf.itemListViewForTier(websession, facility, aTier);
		listview.setupView(pane);
		expect(getRenderedColumns().size()).toBeGreaterThan(1);
	});



	var getRenderedColumns = function() {
		return jqPane.find(".slick-header-column");
	};

});
