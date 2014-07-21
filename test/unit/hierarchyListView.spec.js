goog.require('codeshelf.hierarchylistview');
goog.require('goog.array');

describe('hierarchyListView', function() {
	var websession, jqPane, pane;

	beforeEach(function() {
		websession = jasmine.createSpyObj('websession', ['createCommand', 'sendCommand']);
		jqPane = $("<div/>");
		pane = jqPane.get(0);
	});

	it("initialize view", function() {
		var hierarchyLevel = createDefaultLevel();
		var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevel], -1);
		listview.setupView(pane);
		var total = getAllColumnIds(hierarchyLevel).length;
		expect(getRenderedColumns().size()).toEqual(total);
	});

	describe("column setup", function() {

		it("for a single level a column is created for each property and action", function() {
			var hierarchyLevelDef = createDefaultLevel();

			var total = getAllColumnIds(hierarchyLevelDef).length;
			expect(total).not.toEqual(0);
			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef], -1);
			listview.setupView(pane);
			expect(getRenderedColumns().size()).toEqual(total);

		});

		it("handles levels with no actions", function() {
			var hierarchyLevelDef = createDefaultLevel();
			delete(hierarchyLevelDef.actions);
			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef], -1);
			listview.setupView(pane);
			var total = getAllColumnIds(hierarchyLevelDef).length;
			expect(getRenderedColumns().size()).toEqual(total);
		});

		it("if two levels, columns are not duplicated", function() {
			var hierarchyLevelDef1 = createDefaultLevel();
			var hierarchyLevelDef2 = createDefaultLevel();
			hierarchyLevelDef2.properties  = goog.object.clone(hierarchyLevelDef2.properties);
			hierarchyLevelDef2.properties["additional"] = createProperty("additional");

			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef1, hierarchyLevelDef2], -1);
			listview.setupView(pane);
			var total = getAllColumnIds(hierarchyLevelDef1).length + 1;
			expect(getRenderedColumns().size()).toEqual(total);

		});

		it("should show column by default 'shouldAddThisColumn' ", function() {
			var self = {
				'shouldAddThisColumn': function(inProperty) {
					if(inProperty['id'] == 'idToShow') {
						return true;
					}
					else if (inProperty['id'] == 'idToHide') {
						return false;
					}
					else {
						throw "column filter did not match property, " + inProperty['id'];
					}
				}
			};

			var hierarchyLevelDef1 = createLevel([createProperty("idToShow"), createProperty("idToHide")], []);


			var listview = codeshelf.hierarchylistview(websession, {}, [hierarchyLevelDef1], -1);
			jQuery.extend(listview, self);
			listview.setupView(pane);
			expect(getAllColumnIds(hierarchyLevelDef1).length).toEqual(2);
			expect(getRenderedColumns().size()).toEqual(1);

		});
	});

	describe("default comparer for level", function() {



		it("returns zero if properties have undefined values", function() {
			var itemA = {
				"first": undefined
			};
			var itemB = {
				"first": undefined
			};


			var comparer = createComparer(["first"]);
			expect(comparer(itemA, itemB)).toEqual(0);

		});

		it("uses next property if first values are undefined", function() {
			var itemA = {
				"first": undefined,
				"second": 1
			};
			var itemB = {
				"first": undefined,
				"second": 2
			};


			var comparer = createComparer(["first", "second"]);
			expect(comparer(itemA, itemB)).toEqual(-1);

		});

		it("if first property is equal use second", function() {
			var itemA = {
				"first": 1,
				"second": 1
			};
			var itemB = {
				"first": 1,
				"second": 2
			};


			var comparer = createComparer(["first", "second"]);
			expect(comparer(itemA, itemB)).toEqual(-1);

		});


		it("if first property sorts first, ignores second", function() {
			var itemA = {
				"first": 1,
				"second": 1
			};
			var itemB = {
				"first": 2,
				"second": 1
			};


			var comparer = createComparer(["first", "second"]);
			expect(comparer(itemA, itemB)).toEqual(-1);

		});

		it("if property is string sorts localeCompare", function() {
			var itemA = {
				"first": "a",
				"second": 1
			};
			var itemB = {
				"first": "b",
				"second": 1
			};

			var comparer = createComparer(["first", "second"]);
			expect(comparer(itemA, itemB)).toEqual(-1);

		});

		it("if property is boolean sorts true first", function() {
			var itemA = {
				"first": true,
				"second": 1
			};
			var itemB = {
				"first": false,
				"second": 1
			};


			var comparer = createComparer(["first", "second"]);
			expect(comparer(itemA, itemB)).toEqual(-1);

		});

		function createComparer(properties) {
			return goog.partial(codeshelf.grid.propertyComparer, function() {
				return properties;
			});
		};
	});

	var createProperty = function(id) {
		return {
			'id':   id,
			'title': id.toUpperCase(),
			'width': 25
		};
	};

	var createAction = function(id) {
		return {
			id: id,
			title: id.toUpperCase(),
			handler: function(dataItem) {
				console.log("do light");
			}
		};
	};

	var createDefaultLevel = function() {
		return createLevel([createProperty("testProperty")], []);
	};

	var createLevel = function(properties, actions) {
		var propertiesObj = {};
		if(properties instanceof Array) {
			goog.array.forEach(properties, function(property) {
				propertiesObj[property.id] = property;
			});
		}
		else {
			throw "property array required";
		}

		var actionsObj = {};
		if(actions instanceof Array) {
			goog.array.forEach(actions, function(action) {
				propertiesObj[action.id] = action;
			});
		}
		else {
			throw "actions array required";
		}
		var filter  = 'parent.persistentId = :theId';

		var filterParams = [
			{ 'name': 'theId', 'value': "persistentid-aaaaa"}
		];

		var hierarchyLevel =
			{
				className: "testclassname",
				linkProperty: 'parent',
				filter : filter,
				filterParams : filterParams,
				properties: propertiesObj,
				actions: actionsObj
			};
		return hierarchyLevel;
	};

	var getAllColumnIds = function(hierarchyLevel) {
		var propKeys = goog.object.getKeys(hierarchyLevel.properties);
		var actionKeys = goog.object.getKeys(hierarchyLevel.actions);
		return propKeys.concat(actionKeys);
	};

	var getRenderedColumns = function() {
		return jqPane.find(".slick-header-column");
	};

});
