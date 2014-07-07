goog.provide('codeshelf.listview');









codeshelf.listview = function(viewName, websession, domainObject, filterClause, filterParams) {

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
	var viewName_ = viewName;

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

	var menu_;

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

		getViewName: function() {
			return viewName_;
		},

		doSetupView: function() {

			// Compute the columns we need for this domain object.
			properties = domainObject_['properties'];
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

			dataView_ = new Slick.Data.DataView();
			grid_ = new Slick.Grid(self.getMainPaneElement(), dataView_, columns_, options_);
			grid_.setSelectionModel(new Slick.RowSelectionModel());

			goog.dom.appendChild(self.getMainPaneElement(), soy.renderAsElement(codeshelf.templates.listViewContextMenu));

			var columnpicker = new Slick.Controls.ColumnPicker(columns_, grid_, options_);

			var data = {
				'className':     domainObject_['className'],
				'propertyNames': properties_,
				'filterClause':  filterClause_,
				'filterParams':  filterParams_
			};

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			menu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			menu_.bind('mouseleave', function(e) {
				$(this).fadeOut(5)
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

			grid_.onContextMenu.subscribe(function(event) {
				if (event && event.stopPropagation)
					event.stopPropagation();
//				e.preventDefault();
//				var cell = grid_.getCellFromEvent(e);
//				$("#contextMenu")
//					.data("row", cell.row)
//					.css("top", e.offsetY)
//					.css("left", e.offsetX)
//					.show();
//
//				$("body").one("click", function () {
//					$("#contextMenu").hide();
//				});

				event.preventDefault();
				menu_.empty();

				var $li, $input;
				for (var i = 0; i < columns_.length; i++) {
					$li = $('<li />').appendTo(menu_);

					$input = $("<input type='checkbox' />")
						.attr('id', 'columnpicker_' + i)
						.data('id', columns_[i].id)
						.appendTo($li);

					if (grid_.getColumnIndex(columns_[i].id) != null)
						$input.attr('checked', 'checked');

					$("<label for='columnpicker_" + i + "' />")
						.text(columns_[i].name)
						.appendTo($li);
				}


				menu_
					.css('top', event.pageY - 10)
					.css('left', event.pageX - 10)
					.fadeIn(5);//options['fadeSpeed']);

			});

			grid_.onColumnsReordered.subscribe(function(event) {
				dataView_.sort(self.comparer, sortdir_);
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
				sortdir_ = args.sortAsc ? 1 : -1;
				sortcol_ = args.sortCol.field;
				dataView_.sort(comparer, args.sortAsc);
			});

			// wire up model events to drive the grid
			dataView_.onRowCountChanged.subscribe(function(event, args) {
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

			dataView_.onPagingInfoChanged.subscribe(function(event, pagingInfo) {
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

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
};
