import {Record} from 'immutable';

const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

const initState = new (Record({
  isOpen: false,
}));

export function sidebarReducer(state = initState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return state.set("isOpen", action.value);
    }
    default: return state;
  }
}

export function acToggleSidebar(value) {
  return {
    type: TOGGLE_SIDEBAR,
    value,
  }
}
