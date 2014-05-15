goog.provide('codeshelf.hierarchylistview');
goog.require('extern.jquery');
goog.require('goog.async.Delay');
goog.require('slickgrid.cellcopymanager');
goog.require('slickgrid.cellselection');
goog.require('slickgrid.columnpicker');
goog.require('slickgrid.dataview');
goog.require('slickgrid.editors');
goog.require('slickgrid.formatters');
goog.require('slickgrid.grid');
goog.require('slickgrid.pager');
goog.require('slickgrid.rowmovemanager');
goog.require('slickgrid.rowselection');

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
	var sortdir_ = 1;
	var percentCompleteThreshold_;
	var searchString_;
	var sortDelay_;

	/**
	 * Get the root item in the hierarchy for this item.
	 * @param {Object} item  The item where we want to get the parent.
	 * @param {Integer} level The level above this item in the hierarchy class.
	 * @return {Object} the root item (at level) for this item.
	 */
	function getParentAtLevel(item, level, linkProperty) {
		var currentLevel = getLevel(item);

		if (item['parentAtLevel'] === undefined) {
			item['parentAtLevel'] = [];
		}

		if (level === currentLevel) {
			item['parentAtLevel'][level] = item;
		} else {
			if (item['parentAtLevel'][level] === undefined) {
				var dataItems = dataView_.getItems();
				for (var dataItemPos in dataItems) {
					if (dataItems.hasOwnProperty(dataItemPos)) {
						if (dataItems[dataItemPos]['persistentId'] === item[linkProperty]) {
							item['parentAtLevel'][level] = getParentAtLevel(dataItems[dataItemPos], level, hierarchyMap_[level].linkProperty + 'PersistentId');
							break;
						}
					}
				}
			}
		}

		return item['parentAtLevel'][level];
	}

	/**
	 * Figure our what level this item is on based on the class hierarchy.
	 * @param item
	 * @return {Integer}  the level (0-n)
	 */
	function getLevel(item) {
		if (item['getLevel'] !== undefined) {
			return item['getLevel'];
		}

		for (var hierarcyPos in hierarchyMap_) {
			if (hierarchyMap_.hasOwnProperty(hierarcyPos)) {
				if (item['className'] === hierarchyMap_[hierarcyPos].className) {
					item['getLevel'] = parseInt(hierarcyPos, 10);
					return item['getLevel'];
				}
			}
		}
	}

	/**
	 * Compare the colums from left-to-right (so that they sort left-to-right).
	 * @param itemA
	 * @param itemB
	 * @return {Number}
	 */
	function comparer(itemA, itemB) {

//		logger_.info('A: ' + itemA.fullDomainId);
//		logger_.info('B: ' + itemB.fullDomainId);

		var result = 0;
		var itemALevel = getLevel(itemA);
		var itemBLevel = getLevel(itemB);

		if (itemALevel === itemBLevel) {
			// The items are at the same level, so we can attempt to compare them.

			// Direct compare can only happen if the objects share the same parent.
			if (itemA['parentPersistentId'] !== itemB['parentPersistentId']) {
				var parentA = getParentAtLevel(itemA, itemALevel - 1, hierarchyMap_[itemALevel].linkProperty + 'PersistentId');
				var parentB = getParentAtLevel(itemB, itemBLevel - 1, hierarchyMap_[itemBLevel].linkProperty + 'PersistentId');
				result = comparer(parentA, parentB);
			} else {
				if (hierarchyMap_[itemALevel].comparer !== undefined) {
					// If we've defined a comparer at this level then use it.
					result = hierarchyMap_[itemALevel].comparer(itemA, itemB);
				} else {
					// If the two items are at the same level then compare them by column values from left-to-right.
					var columns = grid_.getColumns();
					for (var column in columns) {
						if (columns.hasOwnProperty(column)) {
							if (itemA[columns[column].id] !== itemB[columns[column].id]) {
								var x = itemA[columns[column].id];
								var y = itemB[columns[column].id];

								if (sortdir_) {
									result = (x === y ? 0 : (x > y ? 1 : -1));
									break;
								} else {
									result = (x === y ? 0 : (x < y ? 1 : -1));
									break;
								}
							}
						}
					}
				}
			}
		} else {
			// The items are at different levels, so we need to find a common level where we can compare them.
			if (itemALevel < itemBLevel) {
				itemB = getParentAtLevel(itemB, itemALevel, hierarchyMap_[itemBLevel].linkProperty + 'PersistentId');
				if ((itemB === undefined) || (itemA['persistentId'] === itemB['persistentId'])) {
					result = -1;
				} else {
					result = comparer(itemA, itemB);
				}
			} else {
				itemA = getParentAtLevel(itemA, itemBLevel, hierarchyMap_[itemALevel].linkProperty + 'PersistentId');
				if ((itemA === undefined) || (itemA['persistentId'] === itemB['persistentId'])) {
					result = 1;
				} else {
					result = comparer(itemA, itemB);
				}
			}
		}

//		logger_.info('R: ' + result);
		return result;
	}

	function removeChildren(object) {
		dataView_.deleteItem(object['persistentId']);
		var items = dataView_.getItems();
		for (var key = 0; key < items.length; key++) {
			if (items.hasOwnProperty(key)) {
				item = items[key];
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
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['data']['results'].length; i++) {
						var object = command['data']['results'][i];

						// If this is an object create or update then we need to check if it's already added to the view.
						// If it's not already added to the view, then send a filter request to get all of the child objects that goes with it.
						if ((object['op'] === 'cre') || (object['op'] === 'upd')) {
							for (var j = 0; j < (hierarchyMap_.length - 1); j++) {
								if (hierarchyMap_[j].className === object['className']) {
									item = dataView_.getItemById(object['persistentId']);
									if (item === undefined) {

										var filter = hierarchyMap_[j + 1].linkProperty + '.persistentId = :theId';
										if (hierarchyMap_[j + 1].filter !== undefined) {
											filter += ' and ' + hierarchyMap_[j + 1].filter;
										}

										var filterParams = [
											{ 'name': 'theId', 'value': object['persistentId']}
										];
										if (hierarchyMap_[j + 1].filterParams !== undefined) {
											filterParams.push(hierarchyMap_[j + 1].filterParams);
										}

										var computedProperties = [];
										for (property in hierarchyMap_[j + 1].properties) {
											if (hierarchyMap_[j + 1].properties.hasOwnProperty(property)) {
												computedProperties.push(hierarchyMap_[j + 1].properties[property].id);
											}
										}
										computedProperties.push(hierarchyMap_[j + 1].linkProperty + 'PersistentId');

										var data = {
											'className':     hierarchyMap_[j + 1].className,
											'propertyNames': computedProperties,
											'filterClause':  filter,
											'filterParams':  filterParams
										};

										var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
										websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
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
		self.doContextMenu(event, item, columns_[cell.cell]);
	}

	var self = {
		doSetupView: function() {

			var count = 0;
			// If we've specified drag-ordering then present a drag-ordering column.
			if (draggableHierarchyLevel_ != -1) {
				// Compute the columns we need for this domain object.
				count = 1;
				columns_[0] = {
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
			}
			var extraColumns = [];
			var computedProperties = [];
			for (var i = 0; i < hierarchyMap_.length; i++) {
				var className = hierarchyMap_[i].className;
				var properties = hierarchyMap_[i].properties;
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						var property = properties[property];

						// Check if the property already exists in the columns.
						var foundEntry = goog.array.find(columns_, function (entry) {
							return entry.id === property.id;
						});

						if (foundEntry === null) {
							// default is to just add all available columns.
							if (this.hasOwnProperty('shouldAddThisColumn') &&  !this.shouldAddThisColumn(property)) {
								// property is going into the view, but we want it out of the view.
								extraColumns.push(property);
							}

							if (domainObject_['properties'][property.id] !== undefined) {
									computedProperties.push(property.id);
							}

							columns_[count++] = {
								'id': property.id,
								'name': property.title,
								'field': property.id,
								'behavior': 'select',
								'headerCssClass': ' ',
								'width': property.width,
								'cannotTriggerInsert': true,
								'resizable': true,
								'selectable': true,
								'sortable': true
							};
						}
					}
				}
			}

			options_ = {
				'editable':             true,
				'enableAddRow':         true,
				'enableCellNavigation': true,
				'asyncEditorLoading':   true,
				'forceFitColumns':      true,
				'topPanelHeight':       25,
				'autoEdit':             false
			};

			percentCompleteThreshold_ = 0;
			searchString_ = '';

			goog.dom.appendChild(self.getMainPaneElement(), soy.renderAsElement(codeshelf.templates.listviewContentPane));

			self.setupContextMenu();

			dataView_ = new Slick.Data.DataView();
			grid_ = new Slick.Grid(self.getMainPaneElement(), dataView_, columns_, options_);

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

			var data = {
				'className':     domainObject_['className'],
				'propertyNames': computedProperties,
				'filterClause':  hierarchyMap_[0].filter,
				'filterParams':  hierarchyMap_[0].filterParams
			};

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			grid_.onClick.subscribe(function(event) {
				var cell = grid_.getCellFromEvent(event);
			});

			grid_.onKeyDown.subscribe(function(event) {
				// select all rows on ctrl-a
				if (event.which != 65 || !event.ctrlKey)
					return false;

				var rows = [];
				selectedRowIds_ = [];

				for (var i = 0; i < dataView_.getLength(); i++) {
					rows.push(i);
					selectedRowIds_.push(dataView_.getItem(i).id);
				}

				grid_.setSelectedRows(rows);
				event.preventDefault();
			});

			grid_.onColumnsReordered.subscribe(function(event) {
				dataView_.sort(comparer, sortdir_);
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
				sortdir_ = args.sortAsc;
				dataView_.sort(comparer, 1);
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
				dataView_.sort(comparer, sortdir_)
			}, 500);

			// remove extra columns that are not part of this view's default set
			var oldColumns = grid_.getColumns();
			var newColumns = [];

			for (var i = 0, l = oldColumns.length; i < l; i++) {
				columnProperty = oldColumns[i];
				var foundMatch = false;
				for (var j = 0, ln = extraColumns.length; j < ln; j++) {
					extraColumnProperty = extraColumns[j];
					// extra columns are not the same kind of object,but both have the id property
					if (columnProperty['id'] === extraColumnProperty['id'])
						foundMatch = true;
				}
				if (!foundMatch){
					newColumns.push(columnProperty);
				}
			}
			if (oldColumns.length != newColumns.length)
				grid_.setColumns(newColumns);
			// end default set

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
				                        percentCompleteThreshold: percentCompleteThreshold_,
				                        searchString:             searchString_
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
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
}
;
