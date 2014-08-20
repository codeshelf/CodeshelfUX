goog.provide('codeshelf.hierarchylistview');
goog.require('codeshelf.multilevelcomparer');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
goog.require('goog.async.Delay');
goog.require('goog.object');

//require jquery ui resizable
/**
 * @param {Array.<codeshelf.HierarchyLevel>} hierarchyMap
 */
codeshelf.hierarchylistview = function(websession, domainObject, hierarchyMap, viewOptions) {

	var logger_ = goog.debug.Logger.getLogger('codeshelf.hierarchylistview');

	$('.grid-header .ui-icon').addClass('ui-state-default ui-corner-all')['mouseover'](
		function(e) {
			$(e.target).addClass('ui-state-hover');
		})['mouseout'](function(e) {
		$(e.target).removeClass('ui-state-hover');
	});

	var defaultViewOptions = {
		"editable": true,
		"draggableHierarchyLevel" : -1
	};

	var websession_ = websession;
	var domainObject_ = domainObject;
	var hierarchyMap_ = hierarchyMap;
	var viewOptions_ = goog.object.clone(defaultViewOptions);
	goog.object.extend(viewOptions_, viewOptions);
	var dataView_;
	var grid_;
	var selectedRowIds_ = [];
	var contextMenusByLevel_ = [];

	// Compute the columns we need for this domain object.
	var columns_ = [];

	/**
	 * @type {Slick.Options}
     */
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
				}
			}
		};

		return callback;
	}

	function dispatchContextMenu(event) {
		if (event && event.stopPropagation) {
			event.stopPropagation();

		}
		event.preventDefault();

		var cell = grid_.getCellFromEvent(event);
		var item = dataView_.getItem(cell.row);
		var itemLevel = view.getItemLevel(item);
		var contextMenu = contextMenusByLevel_[itemLevel];
		if (contextMenu != null) {
			contextMenu.doContextMenu(event, item, columns_[cell.cell]);
		}
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

	function newMultilevelCompareFunction(sortAsc) {
			var comparer = new codeshelf.MultilevelComparer(hierarchyMap_, dataView_.getItems(), grid_.getColumns(), sortAsc);
		var compareFunction = goog.bind(comparer.compare, comparer);
		return compareFunction;
	}

	/**
	 * @param {string} className
	 * @param {Object} jqCell
	 * @param {?number} speed
     */
    function flashCell(className, jqCell, speed) {
      speed = speed || 100;
	  function toggleCellClass(times) {
		  if (!times) {
            return;
          }
          setTimeout(function () {
                jqCell.queue(function () {
                  jqCell.toggleClass(className).dequeue();
                  toggleCellClass(times - 1);
                });
              },
              speed);
      }
        toggleCellClass(4);
    }

	/**
	 * @param {Object} item
	 * @param {Object} column
	 * @param {Slick.EditCommand} editCommand
	 */
	function editCommandHandler(item, column, editCommand) {
		editCommand["execute"](); //TODO determine why this gets obfuscated suring compile
		logger_.fine("item edited:" + goog.debug.expose(item));
		var $cell = $(grid_.getCellNode(editCommand['row'], editCommand['cell']));
		$cell.removeClass("cell-updated-success", "cell-updated-fail");
		websession_.update(item, [column['id']])
			.done(function() {
				flashCell("cell-updated-success", $cell);
			})
			.fail(function() {
				$cell.addClass("cell-updated-fail");
			});
	}

	function setupContextMenus(hierarchyMap) {
		for(var i = 0; i < hierarchyMap.length; i++) {
			var hierarchyMapDef = hierarchyMap[i];
			var contextMenuDefs = hierarchyMapDef["contextMenuDefs"];
			if (contextMenuDefs == null) {
				contextMenuDefs = [];
			}
			var filteredContextDefs = goog.array.filter(contextMenuDefs, function(contextDef) {
				var permissionNeeded = contextDef["permission"];
				return websession_.getAuthz().hasPermission(permissionNeeded);
			});
			var contextMenu = null;
			if (filteredContextDefs.length > 0 ) {
				contextMenu = new codeshelf.ContextMenu(filteredContextDefs);
				contextMenu.setupContextMenu();
			}
			contextMenusByLevel_.push(contextMenu);
		}
	}


	function hasContextMenu() {
		return goog.array.some(contextMenusByLevel_, function(contextMenu) { return contextMenu != null;});
	}

	function sortDataView(dataView, sortAsc) {
		dataView.sort(newMultilevelCompareFunction(sortAsc), true);
	}

	function setSortColumn(grid, column, sortAsc) {
		/* Setting sortable false after the render removes the sort indicator whenever reordering is done
		 var allColumns = grid.getColumns();
		for(var i = 0; i < allColumns.length; i++) {
			var sortable = false;
			if (column['id'] == allColumns[i]['id']) {
				sortable = true;
			}
			allColumns[i]['sortable'] = sortable;
		}
*/
		grid_.setSortColumn(column['id'], sortAsc);

	}

	var self_ = {
		logger: goog.debug.Logger.getLogger('hierarch list view'),

		doSetupView: function() {

			columns_ = codeshelf.grid.toColumnsForHierarchy(hierarchyMap_);

			var computedProperties = goog.array.reduce(columns_, function(ids, column) {
				ids.push(column.id);
				return ids;
			}, []);


			// If we've specified drag-ordering then present a drag-ordering column.
			if (viewOptions_["draggableHierarchyLevel"] != -1) {
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
				'editable':             viewOptions_['editable'],
				'enableAddRow':         true,
				'enableCellNavigation': true,
				'asyncEditorLoading':   true,
				'enableColumnReorder':   true,
				'forceFitColumns':      true,
				'topPanelHeight':       25,
				'autoEdit':             true,
				'multiColumnSort': false,
				'cellHighlightCssClass': "cell-changed",

				'editCommandHandler': editCommandHandler
			};

			goog.dom.appendChild(self_.getMainPaneElement(), soy.renderAsElement(codeshelf.templates.listviewContentPane));


			setupContextMenus(hierarchyMap_);
			// setupContextMenu is another psuedo-inheritance pattern thing. No base class method. Just assume it is probably there.
			// If not there, the view will not open correctly. There is no way to check from here whether the descended class has property 'setupContextMenu'.
			if (hasContextMenu()) {
				columns_.push(createContextMenuColumn());
			}

			dataView_ = new Slick.Data.DataView();
			grid_ = new Slick.Grid(self_.getMainPaneElement(), dataView_, columns_, options_);

			if (hasContextMenu()) {
				grid_.onContextMenu.subscribe (dispatchContextMenu);
			}

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
				var sortCols = grid_.getSortColumns();
				var firstSortAsc = sortCols[0]['sortAsc'];
				var firstColumn = grid_.getColumns()[0];
				setSortColumn(grid_, firstColumn, firstSortAsc);
				sortDataView(dataView_, firstSortAsc);
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
				if (!args['multiColumnSort']) {
					var sortAsc = args.sortAsc;
				}
				sortDataView(dataView_, sortAsc);
			});

			// wire up model events to drive the grid
			dataView_.onRowCountChanged.subscribe(function(event, args) {
				grid_.updateRowCount();
				grid_.render();
			});

			dataView_.onRowsChanged.subscribe(function(event, args) {
				var rows = args.rows;
				for(var i = 0; i < rows.length; i++) {
					var row = rows[i];
					grid_.updateRow(row);

				}

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

			grid_.onCellChange.subscribe(function(e, args) {
				logger_.fine("Cell changed" + goog.debug.expose(args));
			});

			sortDelay_ = new goog.async.Delay(function() {
				var firstSortAsc = grid_.getSortColumns()[0]['sortAsc'];
				sortDataView(dataView_, firstSortAsc);
			}, 500);

			// remove extra columns that are not part of this view's default set
			if (self_.hasOwnProperty('shouldAddThisColumn')) {
				var allColumns = grid_.getColumns();
				var columnsToShow = goog.array.filter(allColumns, function(column) {
					if (column['id'] == "context") {
						return true;
					} else {
						return self_['shouldAddThisColumn'](column);
					}
				});
				grid_.setColumns(columnsToShow);
				var sortAsc = true;
				setSortColumn(grid_, columnsToShow[0], sortAsc);
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
					//'headerCssClass': ' ',
					defaultSortAsc: true,
					'width': 10,
					'cannotTriggerInsert': true,
					'resizable': true,
					'selectable': true,
					'sortable': true,  //sortable so that it will set up structure for arrows
					'focusable': false
			};
			goog.object.extend(newColumn, propertyDef);
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
		'sortable': false,
		'formatter': formatter,
		'cellClickHandler': cellClickHandler
	};
	return newActionColumn;
};
