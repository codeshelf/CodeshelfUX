goog.provide('codeshelf.hierarchylistview');
goog.require('goog.ui.Dialog');
goog.require('slickgrid.core');
goog.require('slickgrid.firebugx');
goog.require('slickgrid.editors');
goog.require('slickgrid.rowselection');
goog.require('slickgrid.grid');
goog.require('slickgrid.dataview');
goog.require('slickgrid.pager');
goog.require('slickgrid.columnpicker');
goog.require('extern.jquery');

codeshelf.hierarchylistview = function(websession, domainObject, filterClause, filterParams, hierarchyMap) {

	$(".grid-header .ui-icon").addClass("ui-state-default ui-corner-all")['mouseover'](
		function(e) {
			$(e.target).addClass("ui-state-hover")
		})['mouseout'](function(e) {
		$(e.target).removeClass("ui-state-hover")
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
	var sortcol_;
	var sortdir_;
	var percentCompleteThreshold_;
	var searchString_;

	/**
	 * Compare the colums from left-to-right (so that they sort left-to-right).
	 * @param itemA
	 * @param itemB
	 * @return {Number}
	 */
	function comparer(itemA, itemB) {

		// First figure out if they are at the same level.

		var levelKeyA = itemA['parentFullDomainId'];
		var levelKeyB = itemB['parentFullDomainId'];

		if (levelKeyA == levelKeyB) {
			var columnIndex = grid_.getColumnIndexArray();
			for (var columnId in columnIndex) {
				if (columnIndex.hasOwnProperty(columnId)) {
					if (itemA[columnId] !== itemB[columnId]) {
						var x = itemA[columnId];
						var y = itemB[columnId];
						return (x == y ? 0 : (x > y ? 1 : -1));
					}
				}
			}
		} else {
			return (levelKeyA.length > levelKeyB.length ? 1 : -1);
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
									item = dataView_.getItemById(object['domainId'])
									if (item === undefined) {
										var filter = 'parent.persistentId = :theId';
										var filterParams = [
											{ 'name': "theId", 'value': object['persistentId']}
										]

										var data = {
											'className':     hierarchyMap_[j + 1],
											'propertyNames': properties_,
											'filterClause':  filter,
											'filterParams':  filterParams
										}

										var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
										websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
									}
								}
							}
						}

						if (object['op'] === 'cre') {
							dataView_.addItem(object);
						} else if (object['op'] === 'upd') {
							var item = dataView_.getItemById(object['domainId']);
							if (item === undefined) {
								dataView_.addItem(object);
							} else {
								dataView_.updateItem(object['domainId'], object);
							}
						} else if (object['op'] === 'del') {
							dataView_.deleteItem(object['domainId']);
						}
					}
					dataView_.sort(comparer, sortdir_);
				}
			}
		}

		return callback;
	}

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_METHOD_RESP) {
						var url = command['data']['results'];
						window.open(url, '_blank');
						window.focus();
					}
				}
			}
		}

		return callback;
	}

	var self = {
		doSetupView: function() {

			// Compute the columns we need for this domain object.
			var count = 0;
			for (var i = 0; i < hierarchyMap_.length; i++) {
				var className = hierarchyMap_[i];
				properties = domainobjects[className].properties;
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
								'behavior':            "select",
								'headerCssClass':      " ",
								'width':               property.width,
								'cannotTriggerInsert': true,
								'resizable':           true,
								'selectable':          false,
								'sortable':            true
							}
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
				'topPanelHeight':       25
			};

			sortcol_ = "Description";
			sortdir_ = 1;
			percentCompleteThreshold_ = 0;
			searchString_ = "";

			goog.dom.appendChild(self.getMainPaneElement(), soy.renderAsElement(codeshelf.templates.listviewContentPane));

			dataView_ = new $.Slick.Data.DataView();
			grid_ = new $.Slick.Grid(self.getMainPaneElement(), dataView_, columns_, options_);
			grid_.setSelectionModel(new $.Slick.RowSelectionModel());

			var columnpicker = new $.Slick.Controls.ColumnPicker(columns_, grid_, options_);

			var data = {
				'className':     domainObject_.className,
				'propertyNames': properties_,
				'filterClause':  filterClause_,
				'filterParams':  filterParams_
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			grid_.onClick.subscribe(function(e) {
				var cell = grid_.getCellFromEvent(e);
//				if (grid.getColumns()[cell.cell].id == "priority") {
//					var states = { "Low": "Medium", "Medium": "High", "High": "Low" };
//					data[cell.row].priority = states[data[cell.row].priority];
//					grid.updateRow(cell.row);
//					e.stopPropagation();
//				}

				var buttonSet = new goog.ui.Dialog.ButtonSet().
					addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK).
					addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);

				var dataEntryDialog = codeshelf.dataentrydialog("Link Dropbox", buttonSet);
				var dialogContentElement = soy.renderAsElement(codeshelf.templates.linkDropboxDialog);
				dataEntryDialog.setupDialog(dialogContentElement);
				dataEntryDialog.open(function(event, dialog) {
						if (event.key === goog.ui.Dialog.ButtonSet.DefaultButtons.OK.key) {

							// Call Facility.createAisle();
							var data = {
								'className':    domainobjects.Facility.className,
								'persistentId': 1,
								'methodName':   'linkDropbox',
								'methodArgs':   [
								]
							}

							var linkDropboxCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
							websession_.sendCommand(linkDropboxCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ), true);
						}
					}
				)

			});

			grid_.onKeyDown.subscribe(function(e) {
				// select all rows on ctrl-a
				if (e.which != 65 || !e.ctrlKey)
					return false;

				var rows = [];
				selectedRowIds_ = [];

				for (var i = 0; i < dataView_.getLength(); i++) {
					rows.push(i);
					selectedRowIds_.push(dataView_.getItem(i).id);
				}

				grid_.setSelectedRows(rows);
				e.preventDefault();
			});

			grid_.onColumnsReordered.subscribe(function(e) {
				dataView_.sort(comparer, sortdir_);
			});

			grid_.onSelectedRowsChanged.subscribe(function(e) {
				selectedRowIds_ = [];
				var rows = grid_.getSelectedRows();
				for (var i = 0, l = rows.length; i < l; i++) {
					var item = dataView_.getItem(rows[i]);
					if (item)
						selectedRowIds_.push(item.id);
				}
			});

			grid_.onSort.subscribe(function(e, args) {
				sortdir_ = args.sortAsc ? 1 : -1;
				sortcol_ = args.sortCol.field;
				dataView_.sort(comparer, args.sortAsc);
			});

			// wire up model events to drive the grid
			dataView_.onRowCountChanged.subscribe(function(e, args) {
				grid_.updateRowCount();
				grid_.render();
			});

			dataView_.onRowsChanged.subscribe(function(e, args) {
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

			dataView_.onPagingInfoChanged.subscribe(function(e, pagingInfo) {
				var isLastPage = pagingInfo.pageSize * (pagingInfo.pageNum + 1) - 1 >= pagingInfo.totalRows;
				var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
				var options = grid_.getOptions();

				if (options['enableAddRow'] != enableAddRow)
					grid_.setOptions({
						enableAddRow: enableAddRow
					});
			});
		},

		open: function() {
			var h_runfilters = null;

			var data = [];
			data.getItemMetadata = function(row) {
				if (row % 2 === 1) {
					return {
						"columns": {
							"duration": {
								"colspan": 3
							}
						}
					};
				} else {
					return {
						"columns": {
							0: {
								"colspan": "*"
							}
						}
					};
				}
			};

			// initialize the model after all the events have been hooked up
			dataView_.beginUpdate();
			dataView_.setItems([], 'domainId');
			dataView_.setFilterArgs({
				percentCompleteThreshold: percentCompleteThreshold_,
				searchString:             searchString_
			});
			dataView_.endUpdate();

			$("#gridContainer")['resizable']();
		},

		close: function() {

		},

		doResize: function() {
			grid_.resizeCanvas();
			grid_.autosizeColumns();
		}
	}

// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
}