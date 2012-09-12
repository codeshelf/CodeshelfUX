/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ediServicesView.js,v 1.1 2012/09/12 23:30:35 jeffw Exp $
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

$(".grid-header .ui-icon").addClass("ui-state-default ui-corner-all")['mouseover'](
	function(e) {
		$(e.target).addClass("ui-state-hover")
	})['mouseout'](function(e) {
	$(e.target).removeClass("ui-state-hover")
});


/**
 * The current state of edi files for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The edi view.
 */
codeshelf.ediservicesview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;
	var ediPane_;

	var dataView;
	var grid;
	var data = [];
	var selectedRowIds = [];
	var self;

	var sortcol = "title";
	var sortdir = 1;
	var percentCompleteThreshold = 0;
	var searchString = "";

	function createTreeFromTestData(node, data) {
		node.setHtml(data[0]);
		if (data.length > 1) {
			var children = data[1];
			var childNotCollapsible = 3; // Hard coded to reduce randomness.
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				var childNode = node.getTree().createNode('');

				node.add(childNode);
				createTreeFromTestData(childNode, child);

				if (i == childNotCollapsible && child.length > 1) {
					childNode.setIsUserCollapsible(false);
					childNode.setExpanded(true);
					nonCollapseNode = childNode;
				}

			}
		}
	}

	function websocketCmdCallbackEdiServices() {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty('r')) {
					alert('response has no result');
				} else {
					if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];

							if (object['className'] === domainobjects.dropboxservice.classname) {

								// Create the filter to listen to all EDI documents updates for this service.
								var aisleFilterData = {
									'className':     domainobjects.edidocumentlocator.classname,
									'propertyNames': ['DomainId', 'DocumentId', 'DocumentName', 'Received', 'Processed'],
									'filterClause':  'parentEdiService.persistentId = :theId',
									'filterParams':  [
										{ 'name': "theId", 'value': object['persistentId']}
									]
								}

								var aisleFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, aisleFilterData);
								websession_.sendCommand(aisleFilterCmd, websocketCmdCallbackEdiDocuments(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

								if (object['op'] === 'cr') {

								} else if (object['op'] === 'up') {

								} else if (object['op'] === 'dl') {

								}
							}
						}
					} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		}

		return callback;
	}

	function websocketCmdCallbackEdiDocuments() {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty('r')) {
					alert('response has no result');
				} else {
					if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];

							if (object['className'] === domainobjects.edidocumentlocator.classname) {
								// Vertex updates.
								if (object['op'] === 'cr') {

								} else if (object['op'] === 'up') {

								} else if (object['op'] === 'dl') {

								}
							}
						}
					} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		}

		return callback;
	}

	function requiredFieldValidator(value) {
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
	}

	function comparer(a, b) {
		var x = a[sortcol], y = b[sortcol];
		return (x == y ? 0 : (x > y ? 1 : -1));
	}

	function myFilter(item) {
//		if (item["percentComplete"] < 70) {
//			return false;
//		}
		return true;
	}

	/**
	 * The work area editor object we'll return.
	 * @type {Object}
	 * @private
	 */
	var self = {

		doSetupView: function() {
			var columns = [
				{
					'id':                  "sel",
					'name':                "#",
					'field':               "num",
					'behavior':            "select",
					'cssClass':            "cell-selection",
					'width':               40,
					'cannotTriggerInsert': true,
					'resizable':           true,
					'selectable':          false,
					'sortable':            true
				},
				{
					'id':        "title",
					'name':      "Title",
					'field':     "title",
					'width':     120,
					'minWidth':  120,
					'cssClass':  "cell-title",
					'editor':    TextCellEditor,
					'validator': self.requiredFieldValidator,
					'sortable':  true
				},
				{
					'id':       "duration",
					'name':     "Duration",
					'field':    "duration",
					'editor':   TextCellEditor,
					'sortable': true
				},
				{
					'id':        "%",
					'name':      "% Complete",
					'field':     "percentComplete",
					'minWidth':  80,
					'resizable': true,
					'formatter': GraphicalPercentCompleteCellFormatter,
					'editor':    PercentCompleteCellEditor,
					'sortable':  true
				},
				{
					'id':       "start",
					'name':     "Start",
					'field':    "start",
					'minWidth': 60,
					'editor':   DateCellEditor,
					'sortable': true
				},
				{
					'id':       "finish",
					'name':     "Finish",
					'field':    "finish",
					'minWidth': 60,
					'editor':   DateCellEditor,
					'sortable': true
				},
				{
					'id':                  "effort-driven",
					'name':                "Effort Driven",
					'width':               80,
					'minWidth':            20,
					'cssClass':            "cell-effort-driven",
					'field':               "effortDriven",
					'formatter':           BoolCellFormatter,
					'editor':              YesNoCheckboxCellEditor,
					'cannotTriggerInsert': true,
					'sortable':            true
				}
			];

			var options = {
				'editable':             true,
				'enableAddRow':         true,
				'enableCellNavigation': true,
				'asyncEditorLoading':   true,
				'forceFitColumns':      true,
				'topPanelHeight':       25
			};

			// prepare the data
//			for (var i = 0; i < 50000; i++) {
//				var d = (data[i] = {});
//
//				d["id"] = "id_" + i;
//				d["persistentId"] = "id_" + i;
//				d["num"] = i;
//				d["title"] = "Task " + i;
//				d["duration"] = "5 days";
//				d["percentComplete"] = Math.round(Math.random() * 100);
//				d["start"] = "01/01/2009";
//				d["finish"] = "01/05/2009";
//				d["effortDriven"] = (i % 5 == 0);
//			}

			// Setup the work area view elements.
			var ediServicesView = soy.renderAsElement(codeshelf.templates.ediServicesView);
			goog.dom.appendChild(self.getMainPaneElement(), ediServicesView);

			ediPane_ = ediServicesView.getElementsByClassName('ediServicesPane')[0];
			ediPane_.innerHTML = '<div id="ediGrid" class="windowContent"></div>';

			dataView = new $.Slick.Data.DataView();
			grid = new $.Slick.Grid('#ediGrid', dataView, columns, options);
			grid.setSelectionModel(new $.Slick.CellSelectionModel());

			var copyManager = new $.Slick.CellCopyManager();
			grid.registerPlugin(copyManager);
			copyManager.onCopyCells.subscribe(function(e, args) {
				for (var obj in args.ranges) {
					if (args.ranges.hasOwnProperty(obj)) {
						var range = args.ranges[obj];
						for (var i = 0; i <= range.toRow - range.fromRow; i++) {
							for (var j = 0; j <= range.toCell - range.fromCell; j++) {
								var val = data[range.fromRow + i][columns[range.fromCell + j].field];
							}
						}
					}
				}
			});

			//var pager = new $.Slick.Controls.Pager(dataView, grid, $("#myPager"));
			var columnpicker = new $.Slick.Controls.ColumnPicker(columns, grid, options);

			grid.onCellChange.subscribe(function(e, args) {
				dataView.updateItem(args.item.id, args.item);
			});

			grid.onAddNewRow.subscribe(function(e, args) {
				var item = {
					"num":             data.length,
					"id":              "new_" + (Math.round(Math.random() * 10000)),
					"title":           "New task",
					"duration":        "1 day",
					"percentComplete": 0,
					"start":           "01/01/2009",
					"finish":          "01/01/2009",
					"effortDriven":    false
				};
				$.extend(item, args.item);
				dataView.addItem(item);
			});

			grid.onKeyDown.subscribe(function(e) {
				// select all rows on ctrl-a
				if (e.which != 65 || !e.ctrlKey)
					return false;

				var rows = [];
				selectedRowIds = [];

				for (var i = 0; i < dataView.getLength(); i++) {
					rows.push(i);
					selectedRowIds.push(dataView.getItem(i).id);
				}

				grid.setSelectedRows(rows);
				e.preventDefault();
			});

			grid.onSelectedRowsChanged.subscribe(function(e) {
				selectedRowIds = [];
				var rows = grid.getSelectedRows();
				for (var i = 0, l = rows.length; i < l; i++) {
					var item = dataView.getItem(rows[i]);
					if (item)
						selectedRowIds.push(item.id);
				}
			});

			grid.onSort.subscribe(function(e, args) {
				sortdir = args.sortAsc ? 1 : -1;
				sortcol = args.sortCol.field;

				if ($.browser.msie && $.browser.version <= 8) {
					// using temporary Object.prototype.toString override
					// more limited and does lexicographic sort only by default, but can
					// be much faster

					var percentCompleteValueFn = function() {
						var val = this["percentComplete"];
						if (val < 10)
							return "00" + val;
						else if (val < 100)
							return "0" + val;
						else
							return val;
					};

					// use numeric sort of % and lexicographic for everything else
					dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
				} else {
					// using native sort with comparer
					// preferred method but can be very slow in IE with huge datasets
					dataView.sort(self.comparer, args.sortAsc);
				}
			});

			// wire up model events to drive the grid
			dataView.onRowCountChanged.subscribe(function(e, args) {
				grid.updateRowCount();
				grid.render();
			});

			dataView.onRowsChanged.subscribe(function(e, args) {
				grid.invalidateRows(args.rows);
				grid.render();

				if (selectedRowIds.length > 0) {
					// since how the original data maps onto rows has changed,
					// the selected rows in the grid need to be updated
					var selRows = [];
					for (var i = 0; i < selectedRowIds.length; i++) {
						var idx = dataView.getRowById(selectedRowIds[i]);
						if (idx != undefined)
							selRows.push(idx);
					}

					grid.setSelectedRows(selRows);
				}
			});

			dataView.onPagingInfoChanged.subscribe(function(e, pagingInfo) {
				var isLastPage = pagingInfo.pageSize * (pagingInfo.pageNum + 1) - 1 >= pagingInfo.totalRows;
				var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
				var options = grid.getOptions();

				if (options['enableAddRow'] != enableAddRow)
					grid.setOptions({
						enableAddRow: enableAddRow
					});
			});
		},

		open:  function() {
			// initialize the model after all the events have been hooked up
			dataView.beginUpdate();
			dataView.setItems(data);
			dataView.setFilterArgs({
//				percentCompleteThreshold: percentCompleteThreshold,
//				searchString:             searchString
			});
			dataView.setFilter(myFilter);
			dataView.endUpdate();

			$("#gridContainer")['resizable']();

			// Create the filter to listen to all EDI service updates for this facility.
			var vertexFilterData = {
				'className':     domainobjects.dropboxservice.classname,
				'propertyNames': ['ProvderEnum', 'ServiceStateEnum'],
				'filterClause':  'parentFacility.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var serviceFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(serviceFilterCmd, websocketCmdCallbackEdiServices(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

		},

		close: function() {

		},

		exit: function() {

		},

		doMouseDownHandler: function(event) {

		},

		doGetContentElement: function() {
			return ediPane_;
		},

		canDragSelect: function(event) {
			return true;
		},

		doDraggerBefore: function(event) {

		},

		doDraggerStart: function(event) {

		},

		doDraggerDrag: function(event) {

		},

		doDraggerEnd: function(event) {

		},

		doResize: function() {
			grid.resizeCanvas();
			grid.autosizeColumns();
		},

		doDraw: function() {

		}
	}

	var tools = [
		{id: 'select-tool', title: 'Select', icon: 'select-icon.png'},
		{id: 'delete-tool', title: 'Delete', icon: 'delete-icon.png'}
	]

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view({doHandleSelection: true, doDragSelect: true, toolbarTools: tools});
	jQuery.extend(view, self);
	self = view;

	return view;
}