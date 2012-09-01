goog.provide('codeshelf.listview');
goog.require('slickgrid.core');
goog.require('slickgrid.firebugx');
goog.require('slickgrid.editors');
goog.require('slickgrid.rowselection');
goog.require('slickgrid.grid');
goog.require('slickgrid.dataview');
goog.require('slickgrid.pager');
goog.require('slickgrid.columnpicker');
goog.require('extern.jquery');

codeshelf.listview = function(websession, domainObject, filterClause, filterParams) {

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

	var thisListview_ = {
		setupView: function(contentElement) {

			// Compute the columns we need for this domain object.
			properties = domainObject_.properties;
			var count = 0;
			for (property in properties) {
				if (properties.hasOwnProperty(property)) {
					var property = properties[property];
					properties_[count] = property.id;
					columns_[count++] = {
						'id':                  property.id,
						'name':                property.title,
						'field':               property.id,
						'behavior':            "select",
//				'cssClass':           "cell-selection",
						'headerCssClass':      " ",
						'width':               property.width,
						'cannotTriggerInsert': true,
						'resizable':           true,
						'selectable':          false,
						'sortable':            true
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

			goog.dom.appendChild(contentElement, soy.renderAsElement(codeshelf.templates.listviewContentPane));

			dataView_ = new $.Slick.Data.DataView();
			grid_ = new $.Slick.Grid(contentElement, dataView_, columns_, options_);
			grid_.setSelectionModel(new $.Slick.RowSelectionModel());

			var columnpicker = new $.Slick.Controls.ColumnPicker(columns_, grid_, options_);

			var data = {
				'className':     domainObject_.classname,
				'propertyNames': properties_,
				'filterClause':  filterClause_,
				'filterParams':  filterParams_
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, thisListview_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

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
				dataView_.sort(thisListview_.comparer, sortdir_);
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
				dataView_.sort(thisListview_.comparer, args.sortAsc);
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

			// initialize the model after all the events have been hooked up
			dataView_.beginUpdate();
			//dataView_.setItems(data_);
			dataView_.setFilterArgs({
				percentCompleteThreshold: percentCompleteThreshold_,
				searchString:             searchString_
			});
			//dataView_.setFilter(thisListview_.myFilter);
			dataView_.endUpdate();

			$("#gridContainer")['resizable']();
		},

		close: function() {

		},

		requiredFieldValidator: function(value) {
			if (value == null || value == undefined || !value.length)
				return {
					valid: false,
					msg:   "This is a required field"
				};
			else
				return {
					valid: true,
					msg:   null
				};
		},

		myFilter: function(item, args) {
			if (item)
				return ('tru' === 'tru');
		},

		comparer: function(a, b) {
			var columnIndex = grid_.getColumnIndexArray();
			for (var columnId in columnIndex) {
				if (columnIndex.hasOwnProperty(columnId)) {
					if (a[columnId] !== b[columnId]) {
						var x = a[columnId];
						var y = b[columnId];
						return (x == y ? 0 : (x > y ? 1 : -1));
					}
				}
			}
		},

		toggleFilterRow: function() {
			if ($(grid_.getTopPanel()).is(":visible"))
				grid_.hideTopPanel();
			else
				grid_.showTopPanel();
		},

		doResize: function() {
			grid_.resizeCanvas();
			grid_.autosizeColumns();
		},

		websocketCmdCallback: function(expectedResponseType) {
			var callback = {
				exec:                    function(command) {
					if (!command['d'].hasOwnProperty('r')) {
						alert('response has no result');
					} else if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];
							if (object['op'] === "cr") {
								dataView_.addItem(object);
							} else if (object['op'] === "up") {
								var item = dataView_.getItemById(object['persistentId']);
								if (item === undefined) {
									dataView_.addItem(object);
								} else {
									dataView_.updateItem(object['persistentId'], object);
								}
							} else if (object['op'] === "de") {
								dataView_.deleteItem(object['persistentId']);
							}
						}
						dataView_.sort(thisListview_.comparer, sortdir_);
					}
				}
			}

			return callback;
		}
	}

	jQuery.extend(thisListview_, codeshelf.view());

	return thisListview_;
}