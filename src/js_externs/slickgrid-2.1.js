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
 * @type {Slick.Data.PagingInfo}
 */
Slick.Data.DataView.getPagingInfo =  function() {};

Slick.Grid = {
      "slickGridVersion": "2.1",

      // Events
      "onScroll": {},
      "onSort": {},
      "onHeaderMouseEnter": {},
      "onHeaderMouseLeave": {},
      "onHeaderContextMenu": {},
      "onHeaderClick": {},
      "onHeaderCellRendered": {},
      "onBeforeHeaderCellDestroy": {},
      "onHeaderRowCellRendered": {},
      "onBeforeHeaderRowCellDestroy": {},
      "onMouseEnter": {},
      "onMouseLeave": {},
      "onClick": Slick.Event,
      "onDblClick": {},
      "onContextMenu": {},
      "onKeyDown": {},
      "onAddNewRow": {},
      "onValidationError": {},
      "onViewportChanged": {},
      "onColumnsReordered": {},
      "onColumnsResized": {},
      "onCellChange": {},
      "onBeforeEditCell": {},
      "onBeforeCellEditorDestroy": {},
      "onBeforeDestroy": {},
      "onActiveCellChanged": {},
      "onActiveCellPositionChanged": {},
      "onDragInit": {},
      "onDragStart": {},
      "onDrag": {},
      "onDragEnd": {},
      "onSelectedRowsChanged": {},
      "onCellCssStylesChanged": {},

      // Methods
      "registerPlugin": function() {},
      "unregisterPlugin": function() {},
      "getColumns": function() {},
      "setColumns": function() {},
      "getColumnIndex": function() {},
      "updateColumnHeader": function() {},
      "setSortColumn": function() {},
      "setSortColumns": function() {},
      "getSortColumns": function() {},
      "autosizeColumns": function() {},
      "getOptions": function() {},
      "setOptions": function() {},
      "getData": function() {},
      "getDataLength": function() {},
      "getDataItem": function() {},
      "setData": function() {},
      "getSelectionModel": function() {},
      "setSelectionModel": function() {},
      "getSelectedRows": function() {},
      "setSelectedRows": function() {},
      "getContainerNode": function() {},

      "render": function() {},
      "invalidate": function() {},
      "invalidateRow": function() {},
      "invalidateRows": function() {},
      "invalidateAllRows": function() {},
      "updateCell": function() {},
      "updateRow": function() {},
      "getViewport": function() {},
      "getRenderedRange": function() {},
      "resizeCanvas": function() {},
      "updateRowCount": function() {},
      "scrollRowIntoView": function() {},
      "scrollRowToTop": function() {},
      "scrollCellIntoView": function() {},
      "getCanvasNode": function() {},
      "focus": function() {},

      "getCellFromPoint": function() {},
      "getCellFromEvent": function() {},
      "getActiveCell": function() {},
      "setActiveCell": function() {},
      "getActiveCellNode": function() {},
      "getActiveCellPosition": function() {},
      "resetActiveCell": function() {},
      "editActiveCell": function() {},
      "getCellEditor": function() {},
      "getCellNode": function() {},
      "getCellNodeBox": function() {},
      "canCellBeSelected": function() {},
      "canCellBeActive": function() {},
      "navigatePrev": function() {},
      "navigateNext": function() {},
      "navigateUp": function() {},
      "navigateDown": function() {},
      "navigateLeft": function() {},
      "navigateRight": function() {},
      "gotoCell": function() {},
      "getTopPanel": function() {},
      "setTopPanelVisibility": function() {},
      "setHeaderRowVisibility": function() {},
      "getHeaderRow": function() {},
      "getHeaderRowColumn": function() {},
      "getGridPosition": function() {},
      "flashCell": function() {},
      "addCellCssStyles": function() {},
      "setCellCssStyles": function() {},
      "removeCellCssStyles": function() {},
      "getCellCssStyles": function() {},

      "init": function() {},
      "destroy": function() {},

      // IEditor implementation
      "getEditorLock": function() {},
      "getEditController": function(){}
};

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
 * @typeDef {{
     ranges: Array.<Slick.Range>
   }}
 */
 Slick.SelectedRanges;

/**
 * @type {Array.<Slick.Range>}
 */
Slick.SelectedRanges.ranges;



/**
 * @typeDef {{
     fromRow: Object,
     fromCell: Object,
     toRow: Object,
     toCell: Object
   }}
 */
Slick.Range;

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

Slick.RowMoveManager = function(options) {};

/**
 * @const
 */
Slick.Controls;


/**
 * @constructor
 */
Slick.Controls.ColumnPicker = function(columns, grid, options){};
