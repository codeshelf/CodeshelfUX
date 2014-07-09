'use strict';

goog.require('codeshelf.hierarchylistview');

describe('hierarchyListView', function() {
	var websession, jqPane, pane;

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand']);
		jqPane = $("<div/>");
		pane = jqPane.get(0);
	});

	it("initialize view", function() {
		var hierarchyLevel = createLevel();
		var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevel], -1);
		listview.setupView(pane);
		var total = getAllColumnIds(hierarchyLevel).length;
		expect(jqPane.find(".slick-header-column").size()).toEqual(total);
	});

	describe("column setup", function() {

		it("for a single level a column is created for each property and action", function() {
			var hierarchyLevelDef = createLevel();

			var total = getAllColumnIds(hierarchyLevelDef).length;
			expect(total).not.toEqual(0);
			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef], -1);
			listview.setupView(pane);
			expect(jqPane.find(".slick-header-column").size()).toEqual(total);

		});

		it("handles levels with no actions", function() {
			var hierarchyLevelDef = createLevel();
			delete(hierarchyLevelDef.actions);
			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef], -1);
			listview.setupView(pane);
			var total = getAllColumnIds(hierarchyLevelDef).length;
			expect(jqPane.find(".slick-header-column").size()).toEqual(total);
		});

		it("if two levels, columns are not duplicated", function() {
			var hierarchyLevelDef1 = createLevel();
			var hierarchyLevelDef2 = createLevel();
			hierarchyLevelDef2.properties  = goog.object.clone(hierarchyLevelDef2.properties);
			hierarchyLevelDef2.properties["additional"] = createProperty("additional");

			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef1, hierarchyLevelDef2], -1);
			listview.setupView(pane);
			var total = getAllColumnIds(hierarchyLevelDef1).length + 1;
			expect(jqPane.find(".slick-header-column").size()).toEqual(total);

		});
	});

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

	var getAllColumnIds = function(hierarchyLevel) {
		var propKeys = goog.object.getKeys(hierarchyLevel.properties);
		var actionKeys = goog.object.getKeys(hierarchyLevel.actions);
		return propKeys.concat(actionKeys);
	};

});
