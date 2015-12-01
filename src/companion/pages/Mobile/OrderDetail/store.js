import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility} from "../Facility/get";
import {getOrderDetail} from "./get";
import {getPicks} from "./mockGetPicks";




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


const EXPAND_ITEM = "expand item";
const EXPAND_IMPORT = "expand import";
const EXPAND_PICK = "expand pick";


const GROUP_ITEMS = "group items";
export const GROUP_ITEMS_WORKER = "group by workers";
export const GROUP_ITEMS_TIMESTAMS = "group by timestamp";
export const GROUP_ITEMS_STATUS = "group by status";


const dataLoadingState = {
    whatIsLoaded: null, // store what we are loading. Currently idOfItem
                        // null value means nothing is loading
    data: null,
    error: null,
    whatIsLoading: null,
}

const initState = {
  tab: TAB_DETAIL, // TAB_DETAIL, TAB_ITEMS, TAB_PICKS
  [TAB_DETAIL]: {
    ...dataLoadingState,
  },
  [TAB_ITEMS]: {
    ...dataLoadingState,
    expandedItem: null,
    groupBy: GROUP_ITEMS_TIMESTAMS, // GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS
    sortingOrder: 1, // can be 1 or -1
  },
  [TAB_PICKS]: {
    ...dataLoadingState,
    expandedPick: null,
  },
  [TAB_IMPORTS]: {
    ...dataLoadingState,
    expandedImport: null,
  }
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
    case EXPAND_ITEM: {
      const {itemId: expandedItem} = action;
      return {...state, [TAB_ITEMS]: {...(state[TAB_ITEMS]), expandedItem}};
    }
    case EXPAND_IMPORT: {
      const {importId: expandedImport} = action;
      return {...state, [TAB_IMPORTS]: {...(state[TAB_IMPORTS]), expandedImport}};
    }
    case EXPAND_PICK: {
      const {pickId: expandedPick} = action;
      return {...state, [TAB_PICKS]: {...(state[TAB_PICKS]), expandedPick}};
    }
    case SELECT_TAB: {
      const {tab} = action;
      return {...state, tab};
    }
    default: return state;
  }
}

export function acExpandItem(itemId) {
  return {
    type: EXPAND_ITEM,
    itemId
  }
}

export function acExpandImport(importId) {
  return {
    type: EXPAND_IMPORT,
    importId
  }
}

export function acExpandPick(pickId) {
  return {
    type: EXPAND_PICK,
    pickId
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
    [TAB_PICKS]: getPicks,
    [TAB_IMPORTS]: (orderId) => {
      const nowTime = new Date();
      const monthBefore = new Date();
      monthBefore.setTime(nowTime.getTime()-MILISECONDS_IN_MONTH);
      return getFacilityContext(facilityId).findImportReceipts({
        orderId,
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

