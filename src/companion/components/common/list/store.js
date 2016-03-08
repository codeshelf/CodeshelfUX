import {Map, Record, fromJS, List} from 'immutable';

const MOVE_COLUMNS = 'MOVE_COLUMNS';
const SORT_COLUMN = 'SORT_COLUMN';

const initState = new (Record({
  tables: new Map({
    workersManagement: new Map({
      columns: ["lastName", "firstName", "domainId", "updated"],
      sortSpecs: new Map({"lastName": {order: "asc"}}),
    }),
    printingTemplates: new Map({
      columns: ["name", "active"],
      sortSpecs: new Map({"name": {order: "asc"}})
    })}),
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
