import {Map, Record, fromJS, List} from 'immutable';
import {getList} from './get';

export const MOVE_COLUMNS = 'MOVE_COLUMNS';
export const SORT_COLUMN = 'SORT_COLUMN';
export const CHANGE_COLUMN = 'CHANGE_COLUMN';

export const PERSIST_STATE_PART = [
  ["list", "tables"],
];

const initState = new (Record({
  tables: new Map({
    workersManagement: new Map({
      columns: ["lastName", "firstName", "domainId", "updated"],
      sortSpecs: new Map({"lastName": {order: "asc"}}),
    }),
    printingTemplates: new Map({
      columns: ["name", "active"],
      sortSpecs: new Map({"name": {order: "asc"}})
    }),
    planning: new Map({
      columns: ["orderId", "customerId", "shipperId", "destinationId", "containerId", "dueDate", "status"],
      sortSpecs: new Map({
          "orderId": {order: "asc"}
      }),
    }),
    dailymetric: new Map({
      columns: ["localDateUI", "ordersPicked"],
      sortSpecs: new Map({
        "localDateUI": {order:"desc"}
      }),
    }),
    import: new Map({
      columns: ["received", "filename", "started", "processingTime", "ordersProcessed", "linesProcessed", "linesFailed", "status", "username"],
      sortSpecs: new Map({"started": {order:"desc"}}),
    })
  }),
}));

export function listReducer(state = initState, action) {
  switch (action.type) {
    case MOVE_COLUMNS: {
      const columns = state.tables.getIn([action.key, 'columns']).slice(0);
      const formerPosition = columns.indexOf(action.moved);
      const newPosition = columns.indexOf(action.afterName);
      columns.splice(formerPosition, 1)
      columns.splice(newPosition, 0, action.moved);
      return state.setIn(['tables', action.key, 'columns'], columns);
    }
    case SORT_COLUMN: {
        return state.mergeIn(['tables', action.key, 'sortSpecs'], {[action.columnName]: {order: action.direction}});
    }
    case CHANGE_COLUMN: {
       return state.setIn(['tables', action.storeName, 'columns'], action.data);
    }
    case 'REDUX_STORAGE_LOAD': {
      try {
        const {payload} = action;
        const savedStorage = getList(payload);
        let newState = state;
        newState = newState.mergeIn(['tables'], savedStorage.tables);
        return newState;
      } catch(e) {
        return state;
      }
    }
    default: return state;
  }
}

export function acMoveColumns(moved, afterName, key) {
  return {
    type: MOVE_COLUMNS,
    moved,
    afterName,
    key,
  }
}

export function acSortColumn(columnName, direction, key) {
  return {
    type: SORT_COLUMN,
    columnName,
    direction,
    key,
  }
}

export function acChangeColumns(columns, storeName) {
  return {
    type: CHANGE_COLUMN,
    data: columns.toJS(),
    storeName,
  }
}
