goog.provide('codeshelf.listdemoview');
goog.require('extern.jquery');
goog.require('slickgrid.cellcopymanager');
goog.require('slickgrid.cellselection');
goog.require('slickgrid.columnpicker');
goog.require('slickgrid.core');
goog.require('slickgrid.dataview');
goog.require('slickgrid.editors');
goog.require('slickgrid.firebugx');
goog.require('slickgrid.grid');
goog.require('slickgrid.pager');
goog.require('slickgrid.rowselection');

$('.grid-header .ui-icon').addClass('ui-state-default ui-corner-all')['mouseover'](
	function(e) {
		$(e.target).addClass('ui-state-hover');
	})['mouseout'](function(e) {
	$(e.target).removeClass('ui-state-hover');
});

codeshelf.listdemoview = function() {

	var dataView;
	var grid;
	var data = [];
	var selectedRowIds = [];
	var self;

	var sortcol = 'title';
	var sortdir = 1;
	var percentCompleteThreshold = 0;
	var searchString = '';

	function myFilter(item) {
		if (item['percentComplete'] < 70) {
			return false;
		}

		return true;
	}

	function percentCompleteSort(a, b) {
		return a['percentComplete'] - b['percentComplete'];
	}

	self = {
		requiredFieldValidator: function(value) {
			if (value == null || value == undefined || !value.length)
				return {
					valid: false,
					msg:   'This is a required field'
				};
			else
				return {
					valid: true,
					msg:   null
				};
		},

		comparer: function(a, b) {
			var x = a[sortcol], y = b[sortcol];
			return (x == y ? 0 : (x > y ? 1 : -1));
		},

		toggleFilterRow: function() {
			if ($(grid.getTopPanel()).is(':visible'))
				grid.hideTopPanel();
			else
				grid.showTopPanel();
		},

		doResize: function() {
			grid.resizeCanvas();
			grid.autosizeColumns();
		},

		doSetupView: function() {
			var columns = [
				{
					'id':                  'sel',
					'name':                '#',
					'field':               'num',
					'behavior':            'select',
					'cssClass':            'cell-selection',
					'width':               40,
					'cannotTriggerInsert': true,
					'resizable':           true,
					'selectable':          false,
					'sortable':            true
				},
				{
					'id':        'title',
					'name':      'Title',
					'field':     'title',
					'width':     120,
					'minWidth':  120,
					'cssClass':  'cell-title',
					'editor':    TextCellEditor,
					'validator': self.requiredFieldValidator,
					'sortable':  true
				},
				{
					'id':       'duration',
					'name':     'Duration',
					'field':    'duration',
					'editor':   TextCellEditor,
					'sortable': true
				},
				{
					'id':        '%',
					'name':      '% Complete',
					'field':     'percentComplete',
					'minWidth':  80,
					'resizable': true,
					'formatter': GraphicalPercentCompleteCellFormatter,
					'editor':    PercentCompleteCellEditor,
					'sortable':  true
				},
				{
					'id':       'start',
					'name':     'Start',
					'field':    'start',
					'minWidth': 60,
					'editor':   DateCellEditor,
					'sortable': true
				},
				{
					'id':       'finish',
					'name':     'Finish',
					'field':    'finish',
					'minWidth': 60,
					'editor':   DateCellEditor,
					'sortable': true
				},
				{
					'id':                  'effort-driven',
					'name':                'Effort Driven',
					'width':               80,
					'minWidth':            20,
					'cssClass':            'cell-effort-driven',
					'field':               'effortDriven',
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
			for (var i = 0; i < 50000; i++) {
				var d = (data[i] = {});

				d['id'] = 'id_' + i;
				d['persistentId'] = 'id_' + i;
				d['num'] = i;
				d['title'] = 'Task ' + i;
				d['duration'] = '5 days';
				d['percentComplete'] = Math.round(Math.random() * 100);
				d['start'] = '01/01/2009';
				d['finish'] = '01/05/2009';
				d['effortDriven'] = (i % 5 == 0);
			}

			self.getMainPaneElement().innerHTML = '<div id="listViewGrid" class="windowContent"></div>';
			dataView = new $.Slick.Data.DataView();
			grid = new $.Slick.Grid('#listViewGrid', dataView, columns, options);
			grid.setSelectionModel(new $['Slick']['CellSelectionModel']());

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

			// move the filter panel defined in a hidden div into grid top panel
			$('#inlineFilterPanel').appendTo(grid.getTopPanel()).show();

			grid.onCellChange.subscribe(function(e, args) {
				dataView.updateItem(args.item.id, args.item);
			});

			grid.onAddNewRow.subscribe(function(e, args) {
				var item = {
					'num':             data.length,
					'id':              'new_' + (Math.round(Math.random() * 10000)),
					'title':           'New task',
					'duration':        '1 day',
					'percentComplete': 0,
					'start':           '01/01/2009',
					'finish':          '01/01/2009',
					'effortDriven':    false
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
						var val = this['percentComplete'];
						if (val < 10)
							return '00' + val;
						else if (val < 100)
							return '0' + val;
						else
							return val;
					};

					// use numeric sort of % and lexicographic for everything else
					dataView.fastSort((sortcol == 'percentComplete') ? percentCompleteValueFn : sortcol, args.sortAsc);
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

		open: function() {
			// initialize the model after all the events have been hooked up
			dataView.beginUpdate();
			dataView.setItems(data);
			dataView.setFilterArgs({
				percentCompleteThreshold: percentCompleteThreshold,
				searchString:             searchString
			});
			dataView.setFilter(myFilter);
			dataView.endUpdate();

			$('#gridContainer')['resizable']();
		},

		close: function() {

		}
	};

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
};
