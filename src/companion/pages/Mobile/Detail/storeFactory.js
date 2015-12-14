import moment from "moment";

import {getFacilityContext, ConnectionError} from 'data/csapi';
import {getSelectedFacility} from "../Facility/get";

const SELECT_TAB = 'select tab for detail tab';

const LOADING_DATA = "loading of data for some tab"; // should have setted
// for which tab it is and status of loading
const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SETTING_OPEN = "open settings";
const SETTING_CLOSE = "close settings";

export const SETTING_PROPERTY_VISIBILITY = "set property visibility";
export const SETTING_PROPERTY_ORDER = "set property order";

const EXPAND_SOMETHING = "expand something";

export function createStore(storeName, getLocalStore, ALL_TABS, tabToSetting, tabToApi) {

  const initState = {
    tab: ALL_TABS[0], // TAB_DETAIL, TAB_ITEMS, TAB_PICKS
  };

  const dataLoadingState = {
      whatIsLoaded: null, // store what we are loading. Currently idOfItem
                          // null value means nothing is loading
      data: null,
      error: null,
      whatIsLoading: null,
      loadedTime: null,
  }

  ALL_TABS.forEach((tab) => {
    initState[tab] = {
      ...dataLoadingState,
      expanded: null,
      settings: {
        properties: tabToSetting[tab],
        open: false,
      },
    }
  });

  function detailReducer(state = initState, action) {
    if (action.storeName !== storeName) return state;
    switch (action.type) {
      case LOADING_DATA: {
        const {tab} = action;
        switch (action.status) {
          case STATUS_STARTED: {
            const {whatIsLoading} = action;
            return {...state, [tab]: {...(state[tab]), data: null, error: null, whatIsLoading: whatIsLoading, whatIsLoaded: null, loadedTime: null}};
          }
          case STATUS_OK: {
            const {data, itemId} = action;
            const loadedTime = moment();
            return {...state, [tab]: {...(state[tab]), data, error: null, whatIsLoading: null, whatIsLoaded: itemId, loadedTime}};
          }
          case STATUS_ERROR: {
            const {error} = action;
            const loadedTime = moment();
            return {...state, [tab]: {...(state[tab]), data: null, error, whatIsLoading: null, whatIsLoaded: null, loadedTime}};
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
        const {tab, field, visible} = action;
        const order = state[tab]["settings"]["properties"]["order"];
        const oldProperties = state[tab]["settings"]["properties"]["visibility"];
        const newProperties = {...oldProperties, [field]: visible};
        const filedsInOverview = (order.indexOf("-") === -1)? order : order.slice(0, order.indexOf("-"));
        const checked = filedsInOverview.reduce((prev, curr) => prev + (0 + newProperties[curr]), 0);
        // disable unchecking last value in overview
        if (checked === 0) return state;
        return {
          ...state,
          [tab]: {
            ...state[tab],
            settings: {
              ...state[tab]["settings"],
              properties: {
                ...state[tab]["settings"]["properties"],
                visibility: newProperties,
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
        // at least one thing has to be in overview
        if (newOrder[0] === "-") return state;
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

  function acSettingOpen(tab) {
    return {
      type: SETTING_OPEN,
      tab,
      storeName,
    }
  }

  function acSettingClose(tab) {
    return {
      type: SETTING_CLOSE,
      tab,
      storeName,
    }
  }

  function acSetFieldVisibility(tab, field, visible) {
    if (ALL_TABS.indexOf(tab) === -1) {
      throw "Unexpected tab setting: " + tab;
    }
    return {
      type: SETTING_PROPERTY_VISIBILITY,
      tab,
      field,
      visible,
      storeName,
    }
  }

  function acSetFieldOrder(tab, field, diff) {
    if (ALL_TABS.indexOf(tab) === -1) {
      throw "Unexpected tab setting: " + tab;
    }
    return {
      type: SETTING_PROPERTY_ORDER,
      tab,
      field,
      diff,
      storeName,
    }
  }

  function acExpand(tab, what) {
    return {
      type: EXPAND_SOMETHING,
      tab,
      what,
      storeName,
    }
  }

  function acSelectTab(tab, itemId, forceLoad = false) {
    return (dispatch, getState) => {
      // we can load first tab
      if (tab ===0) tab = ALL_TABS[0];
      const prevTab = getLocalStore(getState()).tab;
      if (prevTab === tab) forceLoad = true;

      if (ALL_TABS.indexOf(tab) === -1) {
        throw "Unexpected tab setting: " + tab;
      }
      dispatch({
        type: SELECT_TAB,
        tab,
        itemId,
        forceLoad,
        storeName,
      });
      return dispatch(acSearch(tab, itemId, forceLoad));
    }
  }

  function search(tab, status, data) {
    return {
      type: LOADING_DATA,
      tab,
      status,
      storeName,
      ...data
    };
  }

  function acSearch(tab, itemId, forceLoad) {
    return (dispatch, getState) => {
      const whatIsLoaded = getLocalStore(getState())[tab].whatIsLoaded;
      if ((whatIsLoaded === itemId) && (!forceLoad)) {
        console.info(`Skip loading order info for ${itemId} beacuse is already loaded`);
        return;
      }
      dispatch(search(tab, STATUS_STARTED, {whatIsLoading: itemId}));

      const selectedfacility = getSelectedFacility(getState());
      if (!selectedfacility || !(selectedfacility.persistentId)) {
        dispatch(search(tab, STATUS_ERROR, {error: "Want to search for orders but no facility is provided"}));
        return;
      }
      const facilityContext = getFacilityContext(selectedfacility.persistentId);

      tabToApi(facilityContext, tab, itemId).catch((error) => {
        console.error(`Error from search for ${storeName}`, error);
        dispatch(search(tab, STATUS_ERROR, {error}));
      })
      .then((data) => {
        const whatIsLoading = getLocalStore(getState())[tab].whatIsLoading;
        if (whatIsLoading === itemId) {
          dispatch(search(tab, STATUS_OK, {data, itemId}));
        }
      });
    }
  }

  return {
    acSearch,
    acSelectTab,
    acExpand,
    acSetFieldOrder,
    acSetFieldVisibility,
    acSettingClose,
    acSettingOpen,
    detailReducer,
  };
}