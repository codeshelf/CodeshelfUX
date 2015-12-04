import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility} from "../Facility/get";
import {getOrderDetail} from "./get";
import {getPicks} from "./mockGetPicks";

import * as fieldSetting from './storeFieldConfig';


const SELECT_TAB = 'select tab for order detail';
export const TAB_DETAIL = "tab detail";
export const TAB_ITEMS = "tab items";
export const TAB_PICKS = "tab picks";
export const TAB_IMPORTS = "tab imports";
const ALL_TABS = [TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS];

const LOADING_DATA = "loading of data for some tab"; // should have setted
// for which tab it is and status of loading
const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SETTING_OPEN = "open settings";
const SETTING_CLOSE = "close settings";

export const SETTING_PROPERTY_VISIBILITY = "set property visibility";
export const SETTING_PROPERTY_ORDER = "set property order";
export const PROPERTY_VISIBILITY_OVERVIEW = "overview";
export const PROPERTY_VISIBILITY_DETAIL = "detail";

const EXPAND_SOMETHING = "expand something";

const dataLoadingState = {
    whatIsLoaded: null, // store what we are loading. Currently idOfItem
                        // null value means nothing is loading
    data: null,
    error: null,
    whatIsLoading: null,
}

export const PERSIST_STATE_PART =[["orderDetail", TAB_ITEMS, "settings", "properties"]];

const initState = {
  tab: TAB_DETAIL, // TAB_DETAIL, TAB_ITEMS, TAB_PICKS
  [TAB_DETAIL]: {
    ...dataLoadingState,
    settings: {
      properties: fieldSetting.headerFieldsSetting,
      open: false,
    }
  },
  [TAB_ITEMS]: {
    ...dataLoadingState,
    expanded: null,
    settings: {
      properties: fieldSetting.itemsFieldsSetting,
      open: false,
    },
  },
  [TAB_PICKS]: {
    ...dataLoadingState,
    expanded: null,
    settings: {
      properties: fieldSetting.picksFieldsSetting,
      open: false,
    },
  },
  [TAB_IMPORTS]: {
    ...dataLoadingState,
    expanded: null,
    settings: {
      properties: fieldSetting.importFieldsSetting,
      open: false,
    },
  },
};

export function orderDetailReducer(state = initState, action) {
  switch (action.type) {
    case LOADING_DATA: {
      const {tab} = action;
      switch (action.status) {
        case STATUS_STARTED: {
          const {whatIsLoading} = action;
          return {...state, [tab]: {...(state[tab]), data: null, error: null, whatIsLoading: whatIsLoading, whatIsLoaded: null}};
        }
        case STATUS_OK: {
          const {data, orderId} = action;
          return {...state, [tab]: {...(state[tab]), data, error: null, whatIsLoading: null, whatIsLoaded: orderId}};
        }
        case STATUS_ERROR: {
          const {error} = action;
          return {...state, [tab]: {...(state[tab]), data: null, error, whatIsLoading: null, whatIsLoaded: null}};
        }
      }
    }
    case SETTING_OPEN: {
      const {tab} = action;
      return {
        ...state,
        [tab]: {
          ...state[tab],
          settings: {
            ...state[tab]["settings"],
            open: true,
          }
        }
      }
    }
    case SETTING_CLOSE: {
      const {tab} = action;
      return {
        ...state,
        [tab]: {
          ...state[tab],
          settings: {
            ...state[tab]["settings"],
            open: false,
          }
        }
      }
    }
    case SETTING_PROPERTY_VISIBILITY: {
      const {tab, view, field, visible} = action;
      const oldProperties = state[tab]["settings"]["properties"][view];
      const newProperties = {...oldProperties, [field]: visible};
      let newPropertiesDetail = {...state[tab]["settings"]["properties"][PROPERTY_VISIBILITY_DETAIL]};
      if (visible && view != PROPERTY_VISIBILITY_DETAIL) {
        newPropertiesDetail[field] = visible;
      }
      const checked = Object.keys(newProperties).reduce((prev, curr) => prev + (0 + newProperties[curr]), 0);
      // disable unchecking last value
      if (checked === 0) return state;
      return {
        ...state,
        [tab]: {
          ...state[tab],
          settings: {
            ...state[tab]["settings"],
            properties: {
              ...state[tab]["settings"]["properties"],
              [PROPERTY_VISIBILITY_DETAIL]: newPropertiesDetail,
              [view]: newProperties,
            }
          }
        }
      };
    }
    case SETTING_PROPERTY_ORDER: {
      const {tab, field, diff} = action;
      const oldOrder = state[tab]["settings"]["properties"]["order"];
      const index = oldOrder.indexOf(field);
      // if field is not in order then do nothing
      if (index === -1) return state;
      // if field is first cant move it up
      if (index === 0 && diff === -1) return state;
      // if field is last cant move it down
      if (index === (oldOrder.length-1) && diff === 1) return state;
      let newOrder = [...oldOrder];
      newOrder[index+diff] = oldOrder[index];
      newOrder[index] = oldOrder[index+diff];
      console.log("NEW ORDER ", newOrder);
      return {
        ...state,
        [tab]: {
          ...state[tab],
          settings: {
            ...state[tab]["settings"],
            properties: {
              ...state[tab]["settings"]["properties"],
              order: newOrder,
            }
          }
        }
      };

    }
    case EXPAND_SOMETHING: {
      const {what: expanded, tab} = action;
      return {...state, [tab]: {...(state[tab]), expanded}};
    }
    case SELECT_TAB: {
      const {tab} = action;
      return {...state, tab};
    }
    default: return state;
  }
}

export function acSettingOpen(tab) {
  return {
    type: SETTING_OPEN,
    tab,
  }
}

export function acSettingClose(tab) {
  return {
    type: SETTING_CLOSE,
    tab,
  }
}

export function acSetFieldVisibility(tab, overview, field, visible) {
  if (ALL_TABS.indexOf(tab) === -1) {
    throw "Unexpected tab setting: " + tab;
  }
  return {
    type: SETTING_PROPERTY_VISIBILITY,
    tab,
    view: (overview)? PROPERTY_VISIBILITY_OVERVIEW: PROPERTY_VISIBILITY_DETAIL,
    field,
    visible,
  }
}

export function acSetFieldOrder(tab, field, diff) {
  if (ALL_TABS.indexOf(tab) === -1) {
    throw "Unexpected tab setting: " + tab;
  }
  return {
    type: SETTING_PROPERTY_ORDER,
    tab,
    field,
    diff,
  }
}

export function acExpand(tab, what) {
  return {
    type: EXPAND_SOMETHING,
    tab,
    what,
  }
}

export function acSelectTab(tab, orderId, forceLoad = false) {
  return (dispatch, getState) => {
    const prevTab = getOrderDetail(getState()).tab;
    if (prevTab === tab) forceLoad = true;

    if (ALL_TABS.indexOf(tab) === -1) {
      throw "Unexpected tab setting: " + tab;
    }
    dispatch({
      type: SELECT_TAB,
      tab,
      orderId,
      forceLoad,
    });
    switch (tab) {
      case TAB_DETAIL: return dispatch(acSearch(TAB_DETAIL, orderId, forceLoad));
      case TAB_ITEMS: return dispatch(acSearch(TAB_ITEMS, orderId, forceLoad))
      case TAB_PICKS: return dispatch(acSearch(TAB_PICKS, orderId, forceLoad))
      case TAB_IMPORTS: return dispatch(acSearch(TAB_IMPORTS, orderId, forceLoad))
    }
  }
}

function search(tab, status, data) {
  return {
    type: LOADING_DATA,
    tab,
    status,
    ...data
  };
}


// all avalible properties for order detail
const orderDetailProperties = ["persistentId", "orderId", "customerId", "shipperId", "destinationId", "containerId",
    "status", "orderLocationAliasIds", "groupUi", "active", "fullDomainId", "wallUi", "orderType", "dueDate", "orderDate"];



const MILISECONDS_IN_MONTH = 1000*60*60*24*31;

// TODO optimize for speed
function tabToApi(facilityId, tab) {
  return {
    [TAB_DETAIL]: (orderId) => getFacilityContext(facilityId).getOrder(orderDetailProperties, orderId),
    [TAB_ITEMS]:  getFacilityContext(facilityId).getOrderDetails,
    //[TAB_PICKS]: getPicks,
    [TAB_PICKS]: getFacilityContext(facilityId).getOrderEvents,
    [TAB_IMPORTS]: (orderId) => {
      const nowTime = new Date();
      const monthBefore = new Date();
      monthBefore.setTime(nowTime.getTime()-MILISECONDS_IN_MONTH);
      return getFacilityContext(facilityId).findImportReceipts({
        orderIds: orderId,
        itemIds: "",
        gtins: "",
        properties: ["orderId"],
        received: `${monthBefore.toISOString()}/${nowTime.toISOString()}`
      })
    }
  }[tab];
}

export function acSearch(tab, orderId, forceLoad) {
  return (dispatch, getState) => {
    const whatIsLoaded = getOrderDetail(getState())[tab].whatIsLoaded;
    if ((whatIsLoaded === orderId) && (!forceLoad)) {
      console.info(`Skip loading order info for ${orderId} beacuse is already loaded`);
      return;
    }
    dispatch(search(tab, STATUS_STARTED, {whatIsLoading: orderId}));

    const selectedfacility = getSelectedFacility(getState());
    if (!selectedfacility || !(selectedfacility.persistentId)) {
      dispatch(search(tab, STATUS_ERROR, {error: "Want to search for orders but no facility is provided"}));
      return;
    }
    const getRequest = tabToApi(selectedfacility.persistentId, tab);

    getRequest(orderId).catch((error) => {
      console.error("Error from search orders", error);
      // Check if i should dispach
      dispatch(search(tab, STATUS_ERROR, {error}));
    })
    .then((data) => {
      const whatIsLoading = getOrderDetail(getState())[tab].whatIsLoading;
      if (whatIsLoading === orderId) {
        dispatch(search(tab, STATUS_OK, {data, orderId}));
      }
    });
  }
}

