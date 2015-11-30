import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility} from "../Facility/store";

const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SELECT_TAB = 'select tab for order detail';
export const TAB_DETAIL = "tab detail";
export const TAB_ITEMS = "tab items";
export const TAB_PICKS = "tab picks";


const LOADING_ = "loading of ";
const LOADING_DETAIL = LOADING_ + TAB_DETAIL;
const LOADING_ITEMS = LOADING_ + TAB_ITEMS;
const LOADING_PICKS = LOADING_ + TAB_PICKS;

const EXPAND_ITEM = "expand item";
const GROUP_ITEMS = "group items";

export const GROUP_ITEMS_WORKER = "group by workers";
export const GROUP_ITEMS_TIMESTAMS = "group by timestamp";
export const GROUP_ITEMS_STATUS = "group by status";


const initState = {
  tab: TAB_DETAIL, // TAB_DETAIL, TAB_ITEMS, TAB_PICKS
  [TAB_DETAIL]: {
    whatIsLoaded: null, // store what we are loading. Currently idOfItem
                        // null value means nothing is loading
    order: null,
    error: null,
    whatIsLoading: null,
  },
  [TAB_ITEMS]: {
    whatIsLoaded: null,
    items: null,
    error: null,
    whatIsLoading: null,
    expandedItem: null,
    groupBy: GROUP_ITEMS_TIMESTAMS, // GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS
    sortingOrder: 1, // can be 1 or -1
  },
  [TAB_PICKS]: {
    whatIsLoaded: null,
    picks: null,
    error: null,
    whatIsLoading: null,
  },
};

export function getOrderDetail(state) {
  return state.orderDetail;
}

export function orderDetailReducer(state = initState, action) {
  switch (action.type) {
    case LOADING_DETAIL: {
      switch (action.status) {
        case STATUS_STARTED: {
          const {whatIsLoading} = action;
          return {...state, [TAB_DETAIL]: {...(state[TAB_DETAIL]), order: null, error: null, whatIsLoading: whatIsLoading, whatIsLoaded: null}};
        }
        case STATUS_OK: {
          const {data: order, orderId} = action;
          return {...state, [TAB_DETAIL]: {...(state[TAB_DETAIL]), order, error: null, whatIsLoading: null, whatIsLoaded: orderId}};
        }
        case STATUS_ERROR: {
          const {error} = action;
          return {...state, [TAB_DETAIL]: {...(state[TAB_DETAIL]), order: null, error, whatIsLoading: null, whatIsLoaded: null}};
        }
      }
    }
    case LOADING_ITEMS: {
      switch (action.status) {
        case STATUS_STARTED: {
          const {whatIsLoading} = action;
          return {...state, [TAB_ITEMS]: {...(state[TAB_ITEMS]), items: null, error: null, whatIsLoading: whatIsLoading, whatIsLoaded: null}};
        }
        case STATUS_OK: {
          const {data: items, orderId} = action;
          return {...state, [TAB_ITEMS]: {...(state[TAB_ITEMS]), items, error: null, whatIsLoading: null, whatIsLoaded: orderId}};
        }
        case STATUS_ERROR: {
          const {error} = action;
          return {...state, [TAB_ITEMS]: {...(state[TAB_ITEMS]), items: null, error, whatIsLoading: null, whatIsLoaded: null}};
        }
      }
    }
    case EXPAND_ITEM: {
      const {itemId: expandedItem} = action;
      return {...state, [TAB_ITEMS]: {...(state[TAB_ITEMS]), expandedItem}};
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


export function acSelectTab(tab, orderId, forceLoad = false) {
  return (dispatch, getState) => {
    const prevTab = getOrderDetail(getState()).tab;
    if (prevTab === tab) forceLoad = true;

    if (tab != TAB_DETAIL && tab != TAB_ITEMS && tab != TAB_PICKS) {
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
    }
  }
}

function search(tab, status, data) {
  return {
    type: LOADING_ + tab,
    status,
    ...data
  };
}


// all avalible properties
const orderDetailProperties = ["persistentId", "orderId", "customerId", "shipperId", "destinationId", "containerId",
    "status", "orderLocationAliasIds", "groupUi", "active", "fullDomainId", "wallUi", "orderType", "dueDate", "orderDate"];


// TODO optimize for speed
function tabToApi(facilityId, tab) {
  return {
    [TAB_DETAIL]: (orderId) => getFacilityContext(facilityId).getOrder(orderDetailProperties, orderId),
    [TAB_ITEMS]:  getFacilityContext(facilityId).getOrderDetails,
    [TAB_PICKS]: getFacilityContext(facilityId).getOrder,
  }[tab];
}

export function acSearch(tab, orderId, forceLoad) {
  return (dispatch, getState) => {
    const whatIsLoaded = getOrderDetail(getState())[tab].whatIsLoaded;
    console.info(`search`, {tab, orderId, whatIsLoaded, forceLoad});
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
      console.log("data !!!!!!!!!!!", data);
      const whatIsLoading = getOrderDetail(getState())[tab].whatIsLoading;
      if (whatIsLoading === orderId) {
        dispatch(search(tab, STATUS_OK, {data, orderId}));
      }
    });
  }
}

