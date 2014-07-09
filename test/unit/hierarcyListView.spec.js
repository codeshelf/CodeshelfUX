'use strict';

goog.require('codeshelf.hierarchylistview');

/* jasmine specs for controllers go here */
describe('hierarchyListView', function() {
	var websession, jqPane, pane;

	var createProperty = function(id) {
		return {
			'id':   id,
			'title': 'ID',
			'width': 25
		};
	};

	var createLevel = function() {
		var tierSlotFilter = 'parent.persistentId = :theId';

		var tierSlotFilterParams = [
			{ 'name': 'theId', 'value': "persistentid-aaaaa"}
		];

		var hierarchyLevel =
			{
				className: domainobjects['Slot']['className'],
				linkProperty: 'parent',
				filter : tierSlotFilter,
				filterParams : tierSlotFilterParams,
				properties: domainobjects['Slot']['properties'],
				actions: [
					{
						id: "context",
						title: "More",
						handler: function(dataItem) {
							self.openContextMenu();
						}
					}
				]
			};
		return hierarchyLevel;
	};

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand']);
		jqPane = $("<div/>");
		pane = jqPane.get(0);
	});

	it("initialize view", function() {
		var hierarchyLevel = createLevel();
		var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevel], -1);
		listview.setupView(pane);
		var total = goog.object.getKeys(hierarchyLevel.properties).length + hierarchyLevel.actions.length;
		expect(jqPane.find(".slick-header-column").size()).toEqual(total);
	});

	describe("column setup", function() {

		it("for a single level a column is created for each property and action", function() {
			var hierarchyLevelDef = {
				properties : [
					createProperty("test1")
				],
				actions: [
					{
						id: "actionId",
						title: "Action Name",
						width: 25
					}
				]
			};
			var columns = codeshelf.grid.toColumnsForHierarchy([hierarchyLevelDef]);
			expect(columns.length).toEqual(hierarchyLevelDef.properties.length + hierarchyLevelDef.actions.length);

		});

		it("handles levels with no actions", function() {
			var level = createLevel();
			delete(level.actions);
			var listview = codeshelf.hierarchylistview(websession, {}, [level], -1);
			listview.setupView(pane);
		});

		it("if two levels, columns are not duplicated", function() {
			var hierarchyLevelDef1 = {
				properties : [createProperty("test1"), createProperty("test2")],
				actions: []
			};
			var hierarchyLevelDef2 = {
				properties : [createProperty("test1"), createProperty("test2"), createProperty("test3")],
				actions: []
			};
			var columns = codeshelf.grid.toColumnsForHierarchy([hierarchyLevelDef1, hierarchyLevelDef2]);
			expect(columns.length).toEqual(3);
		});
	});
});
