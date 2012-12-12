goog.provide('codeshelf.hierarchylistview');
goog.require('extern.jquery');
goog.require('slickgrid.cellcopymanager');
goog.require('slickgrid.cellselection');
goog.require('slickgrid.columnpicker');
goog.require('slickgrid.dataview');
goog.require('slickgrid.editors');
goog.require('slickgrid.formatters');
goog.require('slickgrid.grid');
goog.require('slickgrid.pager');
goog.require('slickgrid.rowselection');

codeshelf.hierarchylistview = function(websession, domainObject, filterClause, filterParams, hierarchyMap) {

	$('.grid-header .ui-icon').addClass('ui-state-default ui-corner-all')['mouseover'](
		function(e) {
			$(e.target).addClass('ui-state-hover');
		})['mouseout'](function(e) {
		$(e.target).removeClass('ui-state-hover');
	});

	var websession_ = websession;
	var domainObject_ = domainObject;
	var filterClause_ = filterClause;
	var filterParams_ = filterParams;
	var hierarchyMap_ = hierarchyMap;

	var dataView_;
	var grid_;
	var selectedRowIds_ = [];
	var properties_ = [];

	// Compute the columns we need for this domain object.
	var columns_ = [];
	var options_;
	var sortdir_ = 1;
	var percentCompleteThreshold_;
	var searchString_;

	/**
	 * Get the root item in the hierarchy for this item.
	 * @param {Object} item  The item where we want to get the parent.
	 * @param {Integer} level The level above this item in the hierarchy class.
	 * @return {Object} the root item (at level 0) for this item.
	 */
	function getParentAtLevel(item, level) {
		var parentItem = undefined;
		var currentLevel = getLevel(item);

		if (level === currentLevel) {
			parentItem = item;
		} else {
			var dataItems = dataView_.getItems();
			for (var dataItemPos in dataItems) {
				if (dataItems.hasOwnProperty(dataItemPos)) {
					if (dataItems[dataItemPos]['fullDomainId'] === item['parentFullDomainId']) {
						return getParentAtLevel(dataItems[dataItemPos], level);
					}
				}
			}
		}
		return parentItem;
	}

	/**
	 * Figure our what level this item is on based on the class hierarchy.
	 * @param item
	 * @return {Integer}  the level (0-n)
	 */
	function getLevel(item) {
		for (var hierarcyPos in hierarchyMap_) {
			if (hierarchyMap_.hasOwnProperty(hierarcyPos)) {
				if (item['className'] === hierarchyMap_[hierarcyPos]) {
					return hierarcyPos;
				}
			}
		}
	}

	/**
	 * Compare the colums from left-to-right (so that they sort left-to-right).
	 * @param inItemA
	 * @param inItemB
	 * @return {Number}
	 */
	function comparer(itemA, itemB) {

		var itemALevel = getLevel(itemA);
		var itemBLevel = getLevel(itemB);

		// First figure out if they are at the same level.
		if (itemALevel === itemBLevel) {
			// If the two items are at the same level then compare them by column values from left-to-right.
			var columns = grid_.getColumns();
			for (var column in columns) {
				if (columns.hasOwnProperty(column)) {
					if (itemA[columns[column]['id']] !== itemB[columns[column]['id']]) {
						var x = itemA[columns[column]['id']];
						var y = itemB[columns[column]['id']];
						if (sortdir_) {
							return (x === y ? 0 : (x > y ? 1 : -1));
						} else {
							return (x === y ? 0 : (x < y ? 1 : -1));
						}
					}
				}
			}
		} else {
			if (itemALevel < itemBLevel) {
				itemB = getParentAtLevel(itemB, itemALevel);
				if ((itemB === undefined) || (itemA['domainId'] === itemB['domainId'])) {
					return -1;
				} else {
					return comparer(itemA, itemB);
				}
			}
			else {
				itemA = getParentAtLevel(itemA, itemBLevel);
				if ((itemA === undefined) || (itemA['domainId'] === itemB['domainId'])) {
					return 1;
				} else {
					return comparer(itemA, itemB);
				}
			}
		}
		return 0;
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
								if (hierarchyMap_[j] === object['className']) {
									item = dataView_.getItemById(object['fullDomainId']);
									if (item === undefined) {
										var filter = 'parent.persistentId = :theId';
										var filterParams = [
											{ 'name': 'theId', 'value': object['persistentId']}
										];

										var data = {
											'className':     hierarchyMap_[j + 1],
											'propertyNames': properties_,
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
							var item = dataView_.getItemById(object['fullDomainId']);
							if (item === undefined) {
								dataView_.addItem(object);
							} else {
								dataView_.updateItem(object['fullDomainId'], object);
							}
						} else if (object['op'] === 'del') {
							dataView_.deleteItem(object['fullDomainId']);
						}
					}
					dataView_.sort(comparer, sortdir_);
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

			// Compute the columns we need for this domain object.
			var count = 0;
			for (var i = 0; i < hierarchyMap_.length; i++) {
				var className = hierarchyMap_[i];
				var properties = domainobjects[className]['properties'];
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						var property = properties[property];

						// Check if the property already exists in the columns.
						var foundEntry = goog.array.find(columns_, function(entry) {
							return entry.id === property.id;
						});

						if (foundEntry === null) {
							properties_[count] = property.id;
							columns_[count++] = {
								'id':                  property.id,
								'name':                property.title,
								'field':               property.id,
								'behavior':            'select',
								'headerCssClass':      ' ',
								'width':               property.width,
								'cannotTriggerInsert': true,
								'resizable':           true,
								'selectable':          true,
								'sortable':            true
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
			grid_.setSelectionModel(new Slick.CellSelectionModel());

			var copyManager = new Slick.CellCopyManager();
			grid_.registerPlugin(copyManager);

			var columnpicker = new Slick.Controls.ColumnPicker(columns_, grid_, options_);

			var data = {
				'className':     domainObject_['className'],
				'propertyNames': properties_,
				'filterClause':  filterClause_,
				'filterParams':  filterParams_
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
			dataView_.setItems([], 'fullDomainId');
			dataView_.setFilterArgs({
				                        percentCompleteThreshold: percentCompleteThreshold_,
				                        searchString:             searchString_
			                        });
			dataView_.endUpdate();

			$('#gridContainer')['resizable']();
		},

		close: function() {

		},

		doResize: function() {
			grid_.resizeCanvas();
			grid_.autosizeColumns();
		}
	};

// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
};
