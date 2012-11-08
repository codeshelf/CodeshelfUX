/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ediServicesView.js,v 1.6 2012/11/08 03:35:10 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.ediservicesview');
goog.require('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The current state of edi files for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The edi view.
 */
codeshelf.ediservicesview = function(websession, facility) {

	$('.grid-header .ui-icon').addClass('ui-state-default ui-corner-all')['mouseover'](
		function(e) {
			$(e.target).addClass('ui-state-hover');
		})['mouseout'](function(e) {
		$(e.target).removeClass('ui-state-hover');
	});

	var websession_ = websession;
	var facility_ = facility;
	var domainObject_ = domainobjects.DropboxService;

	var filterClause_ = 'parent.persistentId = :theId';
	var filterParams_ = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

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

	function comparer(a, b) {
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
		return 0;
	}

	function websocketCmdCallback() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['data']['results'].length; i++) {
						var object = command['data']['results'][i];
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
							dataView_.deleteItem(object['persistentId']);
						}
					}
					dataView_.sort(comparer, sortdir_);
				}
			}
		};

		return callback;
	}

	var self = {
		doSetupView: function() {

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
						'behavior':            'select',
						'headerCssClass':      ' ',
						'width':               property.width,
						'cannotTriggerInsert': true,
						'resizable':           true,
						'selectable':          false,
						'sortable':            true
					};
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

			sortcol_ = 'Description';
			sortdir_ = 1;
			percentCompleteThreshold_ = 0;
			searchString_ = '';

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
			};

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

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
				dataView_.sort(self.comparer, sortdir_);
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

			// initialize the model after all the events have been hooked up
			dataView_.beginUpdate();
			//dataView_.setItems(data_);
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
	var tools = [
		{id: 'select-tool', title: 'Select', icon: 'select-icon.png'},
		{id: 'delete-tool', title: 'Delete', icon: 'delete-icon.png'}
	];

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view({doHandleSelection: true, doDragSelect: true, toolbarTools: tools});
	jQuery.extend(view, self);
	self = view;

	return view;
};
