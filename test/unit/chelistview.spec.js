goog.require('codeshelf.chelistview');
goog.require('goog.array');
goog.require('codeshelf.authz');
describe('cheListView', function() {
	var websession, jqPane, pane;

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand']);
		websession['getAuthz'] = function() {
			return new codeshelf.Authz();
		};
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
