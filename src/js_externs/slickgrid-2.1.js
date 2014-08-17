/**
 * @type {Object}
 * @const
 */
var Slick = {};

/**
 * @typedef {{
     sortAsc,
     rows
   }}
 */
Slick.Event.SortArgs;

/**
 * @type {string}
 */
Slick.Event.SortArgs.sortAsc;

/**
 * @param {function(Object, Object)} fn
 */
Slick.Event.subscribe = function (fn){};

/**
 * @extends {Slick.Event}
 */
Slick.Event.RowChange;

/**
 * @param {function(Object, Slick.Event.SortArgs)} fn
 */
Slick.Event.RowChange.subscribe = function(fn){};


/**
 * @type {Object}
 */
Slick.Data = {};


/**
 * @typedef {{
 *   pageSize: (number),
 *   pageNum: (number),
 *   totalRows: (number),
 *   totalPages: (number)}}
 * }}
 */
Slick.Data.PagingInfo;

/**
 * @type {number}
 */
Slick.Data.PagingInfo.pageSize;


/**
 * @type {number}
 */
Slick.Data.PagingInfo.pageNum;

/**
 * @type {number}
 */
Slick.Data.PagingInfo.totalRows;

/**
 * @type {number}
 */
Slick.Data.PagingInfo.totalPages;


Slick.Data.DataView =  {

		// methods
      "beginUpdate": function() {},
      "endUpdate": function() {},
      "setPagingOptions": function() {},
      "getItems": function() {},
      "setItems": function() {},
      "setFilter": function() {},
      "sort": function() {},
      "fastSort": function() {},
      "reSort": function() {},
      "setGrouping": function() {},
      "getGrouping": function() {},
      "groupBy": function() {},
      "setAggregators": function() {},
      "collapseAllGroups": function() {},
      "expandAllGroups": function() {},
      "collapseGroup": function() {},
      "expandGroup": function() {},
      "getGroups": function() {},
      "getIdxById": function() {},
      "getRowById": function() {},
      "getItemById": function() {},
      "getItemByIdx": function() {},
      "mapRowsToIds": function() {},
      "mapIdsToRows": function() {},
      "setRefreshHints": function() {},
      "setFilterArgs": function() {},
      "refresh": function() {},
      "updateItem": function() {},
      "insertItem": function() {},
      "addItem": function() {},
      "deleteItem": function() {},
      "syncGridSelection": function() {},
      "syncGridCellCssStyles": function() {},

      // data provider methods
      "getLength": function() {},
      "getItem": function() {},
      "getItemMetadata": function() {},

      // events
      "onRowCountChanged": {},
      "onRowsChanged": Slick.Event.RowChange,
      "onPagingInfoChanged": {}
};

/**
 * @return {Slick.Data.PagingInfo}
 */
Slick.Data.DataView.getPagingInfo =  function() {};

/**
 * Creates a new instance of the grid.
 * @constructor
 * @param {Node}              container   Container node to create the grid in.
 * @param {Array.<Object>}      data        An array of objects for databinding.
 * @param {Array}             columns     An array of column definitions.
 * @param {Slick.Options}            options     Grid options.
 **/
Slick.Grid = function(container, data, columns, options) {};


Slick.Grid.prototype.slickGridVersion = "2.1";

// Events
Slick.Grid.prototype.onScroll = Slick.Event;
Slick.Grid.prototype.onSort = Slick.Event;
Slick.Grid.prototype.onHeaderMouseEnter = Slick.Event;
Slick.Grid.prototype.onHeaderMouseLeave = Slick.Event;
Slick.Grid.prototype.onHeaderContextMenu = Slick.Event;
Slick.Grid.prototype.onHeaderClick = Slick.Event;
Slick.Grid.prototype.onHeaderCellRendered = Slick.Event;
Slick.Grid.prototype.onBeforeHeaderCellDestroy = Slick.Event;
Slick.Grid.prototype.onHeaderRowCellRendered = Slick.Event;
Slick.Grid.prototype.onBeforeHeaderRowCellDestroy = Slick.Event;
Slick.Grid.prototype.onMouseEnter = Slick.Event;
Slick.Grid.prototype.onMouseLeave = Slick.Event;
Slick.Grid.prototype.onClick = Slick.Event;
Slick.Grid.prototype.onDblClick = Slick.Event;
Slick.Grid.prototype.onContextMenu = Slick.Event;
Slick.Grid.prototype.onKeyDown = Slick.Event;
Slick.Grid.prototype.onAddNewRow = Slick.Event;
Slick.Grid.prototype.onValidationError = Slick.Event;
Slick.Grid.prototype.onViewportChanged = Slick.Event;
Slick.Grid.prototype.onColumnsReordered = Slick.Event;
Slick.Grid.prototype.onColumnsResized = Slick.Event;
Slick.Grid.prototype.onCellChange = Slick.Event;
Slick.Grid.prototype.onBeforeEditCell = Slick.Event;
Slick.Grid.prototype.onBeforeCellEditorDestroy = Slick.Event;
Slick.Grid.prototype.onBeforeDestroy = Slick.Event;
Slick.Grid.prototype.onActiveCellChanged = Slick.Event;
Slick.Grid.prototype.onActiveCellPositionChanged = Slick.Event;
Slick.Grid.prototype.onDragInit = Slick.Event;
Slick.Grid.prototype.onDragStart = Slick.Event;
Slick.Grid.prototype.onDrag = Slick.Event;
Slick.Grid.prototype.onDragEnd = Slick.Event;
Slick.Grid.prototype.onSelectedRowsChanged = Slick.Event;
Slick.Grid.prototype.onCellCssStylesChanged = Slick.Event;

// Methods
Slick.Grid.prototype.registerPlugin = function() {};
Slick.Grid.prototype.unregisterPlugin = function() {};
Slick.Grid.prototype.getColumns = function() {};
Slick.Grid.prototype.setColumns = function() {};
Slick.Grid.prototype.getColumnIndex = function() {};
Slick.Grid.prototype.updateColumnHeader = function() {};
Slick.Grid.prototype.setSortColumn = function() {};
Slick.Grid.prototype.setSortColumns = function() {};
Slick.Grid.prototype.getSortColumns = function() {};
Slick.Grid.prototype.autosizeColumns = function() {};
Slick.Grid.prototype.getOptions = function() {};
Slick.Grid.prototype.setOptions = function() {};
Slick.Grid.prototype.getData = function() {};
Slick.Grid.prototype.getDataLength = function() {};
Slick.Grid.prototype.getDataItem = function() {};
Slick.Grid.prototype.setData = function() {};
Slick.Grid.prototype.getSelectionModel = function() {};

/**
 * @param {Slick.CellSelectionModel} cellSelectionModel
 */
Slick.Grid.prototype.setSelectionModel = function(cellSelectionModel) {};
Slick.Grid.prototype.getSelectedRows = function() {};
Slick.Grid.prototype.setSelectedRows = function() {};
Slick.Grid.prototype.getContainerNode = function() {};

Slick.Grid.prototype.render = function() {};
Slick.Grid.prototype.invalidate = function() {};
Slick.Grid.prototype.invalidateRow = function() {};
Slick.Grid.prototype.invalidateRows = function() {};
Slick.Grid.prototype.invalidateAllRows = function() {};
Slick.Grid.prototype.updateCell = function() {};
Slick.Grid.prototype.updateRow = function() {};
Slick.Grid.prototype.getViewport = function() {};
Slick.Grid.prototype.getRenderedRange = function() {};
Slick.Grid.prototype.resizeCanvas = function() {};
Slick.Grid.prototype.updateRowCount = function() {};
Slick.Grid.prototype.scrollRowIntoView = function() {};
Slick.Grid.prototype.scrollRowToTop = function() {};
Slick.Grid.prototype.scrollCellIntoView = function() {};
Slick.Grid.prototype.getCanvasNode = function() {};
Slick.Grid.prototype.focus = function() {};

Slick.Grid.prototype.getCellFromPoint = function() {};
Slick.Grid.prototype.getCellFromEvent = function() {};
Slick.Grid.prototype.getActiveCell = function() {};
Slick.Grid.prototype.setActiveCell = function() {};
Slick.Grid.prototype.getActiveCellNode = function() {};
Slick.Grid.prototype.getActiveCellPosition = function() {};
Slick.Grid.prototype.resetActiveCell = function() {};
Slick.Grid.prototype.editActiveCell = function() {};
Slick.Grid.prototype.getCellEditor = function() {};

/**
 * @param {number} row
 * @param {number} cell
 */
Slick.Grid.prototype.getCellNode = function(row, cell) {};
Slick.Grid.prototype.getCellNodeBox = function() {};
Slick.Grid.prototype.canCellBeSelected = function() {};
Slick.Grid.prototype.canCellBeActive = function() {};
Slick.Grid.prototype.navigatePrev = function() {};
Slick.Grid.prototype.navigateNext = function() {};
Slick.Grid.prototype.navigateUp = function() {};
Slick.Grid.prototype.navigateDown = function() {};
Slick.Grid.prototype.navigateLeft = function() {};
Slick.Grid.prototype.navigateRight = function() {};
Slick.Grid.prototype.gotoCell = function() {};
Slick.Grid.prototype.getTopPanel = function() {};
Slick.Grid.prototype.setTopPanelVisibility = function() {};
Slick.Grid.prototype.setHeaderRowVisibility = function() {};
Slick.Grid.prototype.getHeaderRow = function() {};
Slick.Grid.prototype.getHeaderRowColumn = function() {};
Slick.Grid.prototype.getGridPosition = function() {};
Slick.Grid.prototype.flashCell = function() {};
Slick.Grid.prototype.addCellCssStyles = function() {};
Slick.Grid.prototype.setCellCssStyles = function() {};
Slick.Grid.prototype.removeCellCssStyles = function() {};
Slick.Grid.prototype.getCellCssStyles = function() {};

Slick.Grid.prototype.init = function() {};
Slick.Grid.prototype.destroy = function() {};

// IEditor implementation
Slick.Grid.prototype.getEditorLock = function() {};
Slick.Grid.prototype.getEditController = function(){};


/**
 * @typedef {{
     execute: function(),
     undo: function(),
     row: number,
     cell: number
  }}
 */
Slick.EditCommand;

/**
@typedef {{
   editCommandHandler: function(Object, Object, Slick.EditCommand)
}}
 */
Slick.Options;

/**
 * @const
 */
Slick.Editors;

Slick.Editors.Text;

Slick.Editors.PercentComplete;

Slick.Editors.Date;

/**
 * @const
 */
Slick.Formatters;


Slick.Formatters.PercentCompleteBar;

Slick.Formatters.YesNo;

Slick.Editors.YesNoSelect;

/**
 * @constructor
 */
Slick.CellSelectionModel = function() {};



/**
 * @typedef {{
     fromRow: Object,
     fromCell: Object,
     toRow: Object,
     toCell: Object
   }}
 */
Slick.Range;

/**
 * @typedef {{
     ranges: Array.<Slick.Range>
   }}
 */
 Slick.SelectedRanges;

/**
 * @type {Array.<Slick.Range>}
 */
Slick.SelectedRanges.ranges;


/**
 * @type {Object}
 */
Slick.Range.fromRow;

/**
 * @type {Object}
 */
Slick.Range.fromCell;

/**
 * @type {Object}
 */
Slick.Range.toRow;

/**
 * @type {Object}
 */
Slick.Range.toCell;


/**
 * @extends {Slick.Event}
 */
Slick.Event.CopyCells;

/**
 * @param {function(Object, Slick.SelectedRanges)} fn
 */
Slick.Event.CopyCells.subscribe = function(fn){};

Slick.CellCopyManager = {
	"onCopyCells" : Slick.Event.CopyCells
};


/**
 * @constructor
 */
Slick.RowMoveManager = function(options) {};

/**
 * @const
 */
Slick.Controls;


/**
 * @constructor
 */
Slick.Controls.ColumnPicker = function(columns, grid, options){};
