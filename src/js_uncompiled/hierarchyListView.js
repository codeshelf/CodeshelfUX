goog.provide('codeshelf.hierarchylistview');
goog.require('codeshelf.multilevelcomparer');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.async.Delay');
//require jquery ui resizable
/**
 * @param {Array.<codeshelf.HierarchyLevel>} hierarchyMap
 */
codeshelf.hierarchylistview = function(websession, domainObject, hierarchyMap, draggableHierarchyLevel) {

	var logger_ = goog.debug.Logger.getLogger('codeshelf.hierarchylistview');

	$('.grid-header .ui-icon').addClass('ui-state-default ui-corner-all')['mouseover'](
		function(e) {
			$(e.target).addClass('ui-state-hover');
		})['mouseout'](function(e) {
		$(e.target).removeClass('ui-state-hover');
	});

	var websession_ = websession;
	var domainObject_ = domainObject;
	var hierarchyMap_ = hierarchyMap;
	var draggableHierarchyLevel_ = (draggableHierarchyLevel === undefined ? -1 : draggableHierarchyLevel);
	var dataView_;
	var grid_;
	var selectedRowIds_ = [];

	// Compute the columns we need for this domain object.
	var columns_ = [];
	var options_;
	var sortdir_ = true; //ascending
	var sortDelay_;
	var levelsInThisView = hierarchyMap_.length;

	function removeChildren(object) {
		dataView_.deleteItem(object['persistentId']);
		var items = dataView_.getItems();
		for (var key = 0; key < items.length; key++) {
			if (items.hasOwnProperty(key)) {
				var item = items[key];
				if (item['parentPersistentId'] === object['persistentId']) {
					removeChildren(item);
					// We just deleted at least one item and everything has shifted down, so go back a eval the same item again.
					// This may go below zero, but if it loops then the key will increment it back to zero.
					key--;
				}
			}
		}
	}

// When we get an object, check to see if we have it's child objects too.
	function websocketCmdCallback() {
		var callback = {
			exec: function(type,command) {
				if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['results'].length; i++) {
						var object = command['results'][i];

						// If this is an object create or update then we need to check if it's already added to the view.
						// If it's not already added to the view, then send a filter request to get all of the child objects that goes with it.
						if ((object['op'] === 'cre') || (object['op'] === 'upd')) {
							for (var j = 0; j < (hierarchyMap_.length - 1); j++) {
								if (hierarchyMap_[j]["className"] === object['className']) {
									var item = dataView_.getItemById(object['persistentId']);
									if (item === undefined) {

										var filter = hierarchyMap_[j + 1]["linkProperty"] + '.persistentId = :theId';
										if (hierarchyMap_[j + 1]["filter"] !== undefined) {
											filter += ' and ' + hierarchyMap_[j + 1]["filter"];
										}

										var filterParams = [
											{ 'name': 'theId', 'value': object['persistentId']}
										];
										if (hierarchyMap_[j + 1]["filterParams"] !== undefined) {
											filterParams.push(hierarchyMap_[j + 1]["filterParams"]);
										}

										var computedProperties = [];
										for (var property in hierarchyMap_[j + 1]["properties"]) {
											if (hierarchyMap_[j + 1]["properties"].hasOwnProperty(property)) {
												computedProperties.push(hierarchyMap_[j + 1]["properties"][property].id);
											}
										}
										computedProperties.push(hierarchyMap_[j + 1]["linkProperty"] + 'PersistentId');

										/*
										var data = {
											'className':     hierarchyMap_[j + 1]["className"],
											'propertyNames': computedProperties,
											'filterClause':  filter,
											'filterParams':  filterParams
										};
										var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
										*/
										var className = hierarchyMap_[j + 1]["className"];
										var setListViewFilterCmd = websession_.createRegisterFilterRequest(className,computedProperties,filter,filterParams);
										websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(), true);
									}
								}
							}
						}

						if (object['op'] === 'cre') {
							dataView_.addItem(object);
						} else if (object['op'] === 'upd') {
							var item = dataView_.getItemById(object['persistentId']);
							if (item === undefined) {
								dataView_.addItem(object);
							} else {
								dataView_.updateItem(object['persistentId'], object);
							}
						} else if (object['op'] === 'del') {
							removeChildren(object);
						}
					}
					// We don't want to sort right away, because we might be getting a lot of updates.
					// The delay timer gets reset each time we call start - only after updates are quite for 500ms do we sort.
					sortDelay_.start();

					;
				}
			}
		};

		return callback;
	}

	function dispatchContextMenu(event) {
		var cell = grid_.getCellFromEvent(event);
		var item = dataView_.getItem(cell.row);
		self_.doContextMenu(event, item, columns_[cell.cell]);
	}


	/**
	 * Figure our what level this item is on based on the class hierarchy.
	 * @param item
	 * @return {Number}  the level (0-n)
	 */
	function getLevel(item) {
		if (item['getLevel'] !== undefined) {
			return item['getLevel'];
		}

		for(var i = 0; i < hierarchyMap_.length; i++) {
			if (item['className'] === hierarchyMap_[i]['className']) {
				item['getLevel'] = i;
				return item['getLevel'];
			}
		}
		throw "level not found for: " + item['className'];
	};

	// do we need public interface for getLevelsInThisView?
	function _getLevelsInThisView() {
		return levelsInThisView;
	}

	function createContextMenuColumn() {
		var actionDef = {
				   id: "context",
				   title: "More",
				   width: 10,
				   handler: function(event) {
					   dispatchContextMenu(event);
				   }
			   };
		var column = codeshelf.grid.toButtonColumn(actionDef);
		return column;
	}

	function newComparer() {
		var comparer = new codeshelf.MultilevelComparer(hierarchyMap_, dataView_.getItems());
		var compareFunction = goog.bind(comparer.compare, comparer);
		return compareFunction;
	}

	/**
     * returns a compare function by providing a getPropertiesFunc to
     *   codeshelf.grid.propertyComparer
     * @type {function(!Object, !Object)}
     */
	function createDefaultComparer() {

		function gridColumnsToProperties() {
			var columns = grid_.getColumns();
			var columnIds = goog.array.map(columns, function(column) {
				return column["id"];
			});
			return columnIds;
		}

		var partialPropertyCompareFunc = goog.partial(codeshelf.grid.propertyComparer, gridColumnsToProperties);

		return function(itemA, itemB) {

			if  (itemA['persistentId'] == itemB['persistentId']) {
				return 0;
			}
			else {
				var result = partialPropertyCompareFunc(itemA, itemB);
				if (sortdir_) {
					return result;
				}
				else {
					return result*-1;
				}

			}
		};
	}

	var self_ = {
		doSetupView: function() {

			columns_ = codeshelf.grid.toColumnsForHierarchy(hierarchyMap_);

			var extraColumns = goog.array.filter(columns_, function() {
				return (this.hasOwnProperty('shouldAddThisColumn') &&  !this['shouldAddThisColumn'](property));
			});
			var computedProperties = goog.array.reduce(columns_, function(ids, column) {
				ids.push(column.id);
				return ids;
			}, []);


			// If we've specified drag-ordering then present a drag-ordering column.
			if (draggableHierarchyLevel_ != -1) {
				var selectAndMove = {
					'id':                  'id',
					'name':                '',
					'field':               '',
					'behavior':            'selectAndMove',
					'headerCssClass':      '',
					'width':               40,
					'cannotTriggerInsert': true,
					'resizable':           false,
					'selectable':          false,
					'sortable':            false,
					'cssClass':            'cell-reorder dnd'
				};
				columns_.unshift(selectAndMove);
			}

			options_ = {
				'editable':             true,
				'enableAddRow':         true,
				'enableCellNavigation': true,
				'asyncEditorLoading':   true,
				'enableColumnReorder':   true,
				'forceFitColumns':      true,
				'topPanelHeight':       25,
				'autoEdit':             false
			};

			goog.dom.appendChild(self_.getMainPaneElement(), soy.renderAsElement(codeshelf.templates.listviewContentPane));

			// setupContextMenu is another psuedo-inheritance pattern thing. No base class method. Just assume it is probably there.
			// If not there, the view will not open correctly. There is no way to check from here whether the descended class has property 'setupContextMenu'.
			if (typeof self_.setupContextMenu === 'function') {
				self_.setupContextMenu();
				columns_.push(createContextMenuColumn());
			}

			dataView_ = new Slick.Data.DataView();
			grid_ = new Slick.Grid(self_.getMainPaneElement(), dataView_, columns_, options_);

			grid_.onDragInit.subscribe(function(event, args) {
				var blah = 1;
			});

			// Setup the selection model.
			grid_.setSelectionModel(new Slick.CellSelectionModel());

			// Setup the copy manager.
			var copyManager = new Slick.CellCopyManager();
			grid_.registerPlugin(copyManager);

			// Setup the row move manager (in case a view can move rows).
			var rowMoveManager = new Slick.RowMoveManager({cancelEditOnDrag: true});
			grid_.registerPlugin(rowMoveManager);

			// Setup the column picker, so the user can change the visible columns.
			var columnpicker = new Slick.Controls.ColumnPicker(columns_, grid_, options_);

			for(var i = 0; i < hierarchyMap_.length; i++) {
				var hierarchyLevel = hierarchyMap_[i];
				if (typeof hierarchyLevel["comparer"] === "undefined") {
					hierarchyLevel["comparer"] = createDefaultComparer();
				}
			}

			/*
			var data = {
				'className':     domainObject_['className'],
				'propertyNames': computedProperties,
				'filterClause':  hierarchyMap_[0]["filter"],
				'filterParams':  hierarchyMap_[0]["filterParams"]
			};
			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			*/
			var setListViewFilterCmd = websession_.createRegisterFilterRequest(domainObject_['className'],computedProperties,hierarchyMap_[0]["filter"],hierarchyMap_[0]["filterParams"]);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(), true);

			//Add click handlers from the columns
			goog.array.forEach(columns_, function(column) {

				if(typeof column['cellClickHandler'] === 'function') {
				logger_.fine("register cellClickHandler with grid for column " + column);
					grid_.onClick.subscribe(function(event, args) {
						logger_.fine("cellClickHandler executing for " + column);
						column['cellClickHandler'](event, args);
					});
				}
			});

			grid_.onKeyDown.subscribe(function(event) {
				// select all rows on ctrl-a
				if (event.which == 65 && event.ctrlKey) {
					var rows = [];
					selectedRowIds_ = [];

					for (var i = 0; i < dataView_.getLength(); i++) {
						rows.push(i);
						selectedRowIds_.push(dataView_.getItem(i).id);
					}

					grid_.setSelectedRows(rows);
					event.preventDefault();
				}

			});

			grid_.onColumnsReordered.subscribe(function(event) {
				dataView_.sort(newComparer(), sortdir_);
			});

			grid_.onSelectedRowsChanged.subscribe(function(event) {
				selectedRowIds_ = [];
				var rows = grid_.getSelectedRows();
				for (var i = 0, l = rows.length; i < l; i++) {
					var item = dataView_.getItem(rows[i]);
					if (item)
						selectedRowIds_.push(item.id);
				}
			});

			grid_.onSort.subscribe(function(event, args) {
//				sortdir_ = args.sortAsc;
				dataView_.sort(newComparer(), true);
			});

			// wire up model events to drive the grid
			dataView_.onRowCountChanged.subscribe(function(event, args) {
				grid_.updateRowCount();
				grid_.render();
			});

			dataView_.onRowsChanged.subscribe(function(event, args) {
				grid_.invalidateRows(args.rows);
				grid_.render();

				if (selectedRowIds_.length > 0) {
					// since how the original data maps onto rows has changed,
					// the selected rows in the grid need to be updated
					var selRows = [];
					for (var i = 0; i < selectedRowIds_.length; i++) {
						var idx = dataView_.getRowById(selectedRowIds_[i]);
						if (idx != undefined)
							selRows.push(idx);
					}

					grid_.setSelectedRows(selRows);
				}
			});

			dataView_.onPagingInfoChanged.subscribe(function(event, pagingInfo) {
				var isLastPage = pagingInfo.pageSize * (pagingInfo.pageNum + 1) - 1 >= pagingInfo.totalRows;
				var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
				var options = grid_.getOptions();

				if (options['enableAddRow'] != enableAddRow)
					grid_.setOptions({
						                 enableAddRow: enableAddRow
					                 });
			});

			grid_.onContextMenu.subscribe(dispatchContextMenu);

			sortDelay_ = new goog.async.Delay(function() {
				dataView_.sort(newComparer(), sortdir_);
			}, 500);

			// remove extra columns that are not part of this view's default set
			if (self_.hasOwnProperty('shouldAddThisColumn')) {
				var allColumns = grid_.getColumns();
				var columnsToShow = goog.array.filter(allColumns, function(column) {
					return self_['shouldAddThisColumn'](column);
				});
				grid_.setColumns(columnsToShow);
			}
		},

		open: function() {
			var h_runfilters = null;

			var data = [];
			data.getItemMetadata = function(row) {
				if (row % 2 === 1) {
					return {
						'columns': {
							'duration': {
								'colspan': 3
							}
						}
					};
				} else {
					return {
						'columns': {
							0: {
								'colspan': '*'
							}
						}
					};
				}
			};

			// initialize the model after all the events have been hooked up
			dataView_.beginUpdate();
			dataView_.setItems([], 'persistentId');
			dataView_.setFilterArgs({
				                        percentCompleteThreshold: 0,
				                        searchString:             ''
			                        });
			dataView_.endUpdate();

			$('#gridContainer')['resizable']();
		},

		close: function() {
			var theLogger = goog.debug.Logger.getLogger('hierarch list view');
			theLogger.info("Called this close");
		},

		doResize: function() {
			grid_.resizeCanvas();
			grid_.autosizeColumns();
		},

		// public interface for getLevel
		getItemLevel: function(item) {
			return getLevel(item);
		}

	};

// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view({});
	jQuery.extend(view, self_);
	self_ = view;

	return self_;
};
goog.exportSymbol('codeshelf.hierarchylistview', codeshelf.hierarchylistview);

codeshelf.grid = {};

codeshelf.grid.propertyComparer = function(getPropertiesFunc, itemA, itemB) {
	var result = 0;
	var properties = getPropertiesFunc();
	for(var i = 0; i < properties.length; i++) {
		var property = properties[i];
		var valueA = itemA[property];
		var valueB = itemB[property];

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (typeof valueA === "undefined" && typeof valueB === "undefined") {
			result = 0;
		}
		else if (isNaN(valueA) && isNaN(valueB)
			&& typeof valueA === 'number' && typeof valueB === 'number') {
			result = 0;
		}
		else if (typeof valueA === 'number' && typeof valueB === 'number') {
			if (valueA != valueB) {
				result = (valueA < valueB) ? -1 : 1;
				break;
			}
		}
		else if (typeof valueA === "string" && typeof valueB === "string"){
			result =  goog.string.caseInsensitiveCompare(valueA, valueB);
			if (result != 0) {
				break;
			}
		}
		else if (typeof valueA === "boolean" && typeof valueB === "boolean"){
			if (valueA != valueB) {
				if (valueA == true) {
					result = -1;
					break;
				}
			}
		}
		else { //attempt string compare as default
			if (typeof valueA === "undefined") {
				result = 1;
				break;
			}
			else if (typeof valueB === "undefined"){
				result = -1;
				break;
			}
			else {
				result =  goog.string.caseInsensitiveCompare(valueA.toString(), valueB.toString());
				if (result != 0) {
					break;
				}
			}
		}
	}
	return result;
};



codeshelf.grid.toColumnsForHierarchy = function(hierarchyLevels) {

	var concatenatedColumns = goog.array.reduce(hierarchyLevels, function(allCols, hierarchyLevel) {
		var columns = codeshelf.grid.toColumns(hierarchyLevel);
		return allCols.concat(columns);
	}, []);

	var mergedColumns = [];
	goog.array.removeDuplicates(concatenatedColumns, mergedColumns, function match(item){ return item.id;});
	return mergedColumns;
};

/**
 * Takes a hierarchy level definition and returns columns for the grid
 * @param {codeshelf.HierarchyLevel} hierarchyLevelDef
 */
codeshelf.grid.toColumns = function(hierarchyLevelDef) {
	var columns = [];
	var className = hierarchyLevelDef["className"];
	var properties = hierarchyLevelDef["properties"];
	for (var property in properties) {
		if (properties.hasOwnProperty(property)) {
			var propertyDef = properties[property];
			var newColumn = {
					'id': propertyDef.id,
					'name': propertyDef.title,
					'field': propertyDef.id,
					'behavior': 'select',
					'headerCssClass': ' ',
					'width': propertyDef.width,
					'cannotTriggerInsert': true,
					'resizable': true,
					'selectable': true,
					'sortable': true
			};
		}
			columns.push(newColumn);
	}
	if (!(typeof hierarchyLevelDef.actions == "undefined")) {

		var actions = hierarchyLevelDef.actions;
		for(var key in actions) {
			var actionDef = actions[key];
			var newActionColumn = codeshelf.grid.toButtonColumn(actionDef);
			columns.push(newActionColumn);
		}
	}
	return columns;
};

codeshelf.grid.toButtonColumn = function(actionDef) {
	var targetClasses = ["action", actionDef.id];

	var cellClickHandler = function(event, args) {
		for(var i = 0; i < targetClasses.length; i++) {
			if ($(event.target).closest("." + targetClasses[i]).length == 0) {
				return;
			}
		}
		actionDef.handler(event, args);
	};

	var classAttribute = targetClasses.join(' ');
	var formatter = function(row, cell, value, columnDef, dataContext) {
		return '<button class="btn ' + classAttribute + '" ><span class="glyphicon glyphicon-chevron-down" style="vertical-align:middle"></span></button>';
	};

	var newActionColumn = {
		'id': actionDef.id,
		'name': actionDef.title,
		'field': actionDef.id,
		'behavior': 'select',
		'headerCssClass': ' ',
		'width': actionDef.width,
		'cannotTriggerInsert': true,
		'resizable': true,
		'selectable': false,
		'sortable': true,
		'formatter': formatter,
		'cellClickHandler': cellClickHandler
	};
	return newActionColumn;
};
