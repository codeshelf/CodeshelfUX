goog.provide('codeshelf.listview');
//goog.require('codeshelf.listviewdatamodel');
goog.require('slickgrid.core');
goog.require('slickgrid.firebugx');
goog.require('slickgrid.editors');
goog.require('slickgrid.rowselection');
goog.require('slickgrid.grid');
goog.require('slickgrid.dataview');
goog.require('slickgrid.pager');
goog.require('slickgrid.columnpicker');
goog.require('jquery');

codeshelf.listview = function (domainObject) {

	$(".grid-header .ui-icon").addClass("ui-state-default ui-corner-all").mouseover(
		function (e) {
			$(e.target).addClass("ui-state-hover")
		}).mouseout(function (e) {
			$(e.target).removeClass("ui-state-hover")
		});

	var dataModel_;
	var dataView_;
	var grid_;
	var data_ = [];
	var selectedRowIds_ = [];

	// Compute the columns we need for this domain object.
	var columns_ = [];
	var properties = domainObject['properties'];
	var count = 0;
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			var property = properties[property];
			columns_[count++] = {
				id:                 property.id,
				name:               property.title,
				field:              property.id,
				behavior:           "select",
				cssClass:           "cell-selection",
				width:              property.width,
				cannotTriggerInsert:true,
				resizable:          true,
				selectable:         false,
				sortable:           true
			}
		}
	}

	var options_ = {
		editable:            true,
		enableAddRow:        true,
		enableCellNavigation:true,
		asyncEditorLoading:  true,
		forceFitColumns:     true,
		topPanelHeight:      25
	};

	var sortcol_ = "title";
	var sortdir_ = 1;
	var percentCompleteThreshold_ = 0;
	var searchString_ = "";

	var thisListview_ = {
		requiredFieldValidator:function (value) {
			if (value == null || value == undefined || !value.length)
				return {
					valid:false,
					msg:  "This is a required field"
				};
			else
				return {
					valid:true,
					msg:  null
				};
		},

		myFilter:function (item, args) {
			if (item["percentComplete"] < args.percentCompleteThreshold)
				return false;

			return !(args.searchString != "" && item["title"].indexOf(args.searchString) == -1);

		},

		percentCompleteSort:function (a, b) {
			return a["percentComplete"] - b["percentComplete"];
		},

		comparer:function (a, b) {
			var x = a[sortcol_], y = b[sortcol_];
			return (x == y ? 0 : (x > y ? 1 : -1));
		},

		toggleFilterRow:function () {
			if ($(grid_.getTopPanel()).is(":visible"))
				grid_.hideTopPanel();
			else
				grid_.showTopPanel();
		},

		resizeFunction:function () {
			grid_.resizeCanvas();
			grid_.autosizeColumns();
		},

		launchListView:function (parentFrame) {
			// prepare the data
			for (var i = 0; i < 50000; i++) {
				var d = (data_[i] = {});

				d["id"] = "id_" + i;
				d["num"] = i;
				d["title"] = "Task " + i;
				d["duration"] = "5 days";
				d["percentComplete"] = Math.round(Math.random() * 100);
				d["start"] = "01/01/2009";
				d["finish"] = "01/05/2009";
				d["effortDriven"] = (i % 5 == 0);
			}

			listViewWindow = codeshelf.window();
			listViewWindow.init("List View", parentFrame, undefined, thisListview_.resizeFunction);
			var contentElement = listViewWindow.getContentElement();
			//contentElement.innerHTML = '<div id="listViewGrid" class="windowContent"></div>';
			goog.dom.appendChild(contentElement, soy.renderAsElement(codeshelf.templates.listviewContentPane));

			//dataModel_  = new codeshelf.listviewdatamodel.DataModel();
			//grid_ = new Slick.Grid(contentElement, dataModel_.data, columns_, options_);
			dataView_ = new Slick.Data.DataView();
			grid_ = new Slick.Grid(contentElement, dataView_, columns_, options_);
			grid_.setSelectionModel(new Slick.RowSelectionModel());

			//var pager = new Slick.Controls.Pager(dataView, grid, $("#myPager"));
			var columnpicker = new Slick.Controls.ColumnPicker(columns_, grid_, options_);

			grid_.onViewportChanged.subscribe(function (e, args) {
				var vp = grid_.getViewport();
				dataModel_.ensureData(vp.top, vp.bottom);
			});

			grid_.onSort.subscribe(function (e, args) {
				dataModel_.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
				var vp = grid_.getViewport();
				dataModel_.ensureData(vp.top, vp.bottom);
			});

			// move the filter panel defined in a hidden div into grid top panel
			$("#inlineFilterPanel").appendTo(grid_.getTopPanel()).show();

			grid_.onCellChange.subscribe(function (e, args) {
				dataView_.updateItem(args.item.id, args.item);
			});

			grid_.onAddNewRow.subscribe(function (e, args) {
				var item = {
					"num":            data_.length,
					"id":             "new_" + (Math.round(Math.random() * 10000)),
					"title":          "New task",
					"duration":       "1 day",
					"percentComplete":0,
					"start":          "01/01/2009",
					"finish":         "01/01/2009",
					"effortDriven":   false
				};
				$.extend(item, args.item);
				dataView_.addItem(item);
			});

			grid_.onKeyDown.subscribe(function (e) {
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

			grid_.onSelectedRowsChanged.subscribe(function (e) {
				selectedRowIds_ = [];
				var rows = grid_.getSelectedRows();
				for (var i = 0, l = rows.length; i < l; i++) {
					var item = dataView_.getItem(rows[i]);
					if (item)
						selectedRowIds_.push(item.id);
				}
			});

			grid_.onSort.subscribe(function (e, args) {
				sortdir_ = args.sortAsc ? 1 : -1;
				sortcol_ = args.sortCol.field;

				if ($.browser.msie && $.browser.version <= 8) {
					// using temporary Object.prototype.toString override
					// more limited and does lexicographic sort only by default, but can
					// be much faster

					var percentCompleteValueFn = function () {
						var val = this["percentComplete"];
						if (val < 10)
							return "00" + val;
						else if (val < 100)
							return "0" + val;
						else
							return val;
					};

					// use numeric sort of % and lexicographic for everything else
					dataView_.fastSort((sortcol_ == "percentComplete") ? percentCompleteValueFn : sortcol_, args.sortAsc);
				} else {
					// using native sort with comparer
					// preferred method but can be very slow in IE with huge datasets
					dataView_.sort(thisListview_.comparer, args.sortAsc);
				}
			});

			// wire up model events to drive the grid
			dataView_.onRowCountChanged.subscribe(function (e, args) {
				grid_.updateRowCount();
				grid_.render();
			});

			dataView_.onRowsChanged.subscribe(function (e, args) {
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

			dataView_.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
				var isLastPage = pagingInfo.pageSize * (pagingInfo.pageNum + 1) - 1 >= pagingInfo.totalRows;
				var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
				var options = grid_.getOptions();

				if (options.enableAddRow != enableAddRow)
					grid_.setOptions({
						enableAddRow:enableAddRow
					});
			});

			var h_runfilters = null;

			// wire up the slider to apply the filter to the model
			$("#pcSlider,#pcSlider2").slider({
				"range":"min",
				"slide":function (event, ui) {
					Slick.GlobalEditorLock.cancelCurrentEdit();

					if (percentCompleteThreshold_ != ui.value) {
						window.clearTimeout(h_runfilters);
						h_runfilters = window.setTimeout(updateFilter, 10);
						percentCompleteThreshold_ = ui.value;
					}
				}
			});

			// wire up the search textbox to apply the filter to the model
			$("#txtSearch,#txtSearch2").keyup(function (e) {
				Slick.GlobalEditorLock.cancelCurrentEdit();

				// clear on Esc
				if (e.which == 27)
					thisListview_.value = "";

				searchString_ = thisListview_.value;
				updateFilter();
			});

			function updateFilter() {
				dataView_.setFilterArgs({
					percentCompleteThreshold:percentCompleteThreshold_,
					searchString:            searchString_
				});
				dataView_.refresh();
			}

			$("#btnSelectRows").click(function () {
				if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
					return;
				}

				var rows = [];
				selectedRowIds_ = [];

				for (var i = 0; i < 10 && i < dataView_.getLength(); i++) {
					rows.push(i);
					selectedRowIds_.push(dataView_.getItem(i).id);
				}

				grid_.setSelectedRows(rows);
			});

			// initialize the model after all the events have been hooked up
			dataView_.beginUpdate();
			dataView_.setItems(data_);
			dataView_.setFilterArgs({
				percentCompleteThreshold:percentCompleteThreshold_,
				searchString:            searchString_
			});
			dataView_.setFilter(thisListview_.myFilter);
			dataView_.endUpdate();

			$("#gridContainer").resizable();
		}
	}

	return thisListview_;
}