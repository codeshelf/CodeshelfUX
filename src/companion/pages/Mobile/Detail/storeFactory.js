import moment from "moment";
import _ from "lodash";
import {Map, Record, fromJS} from 'immutable';

import {ConnectionError} from 'data/csapi';
import {getFacilityContextFromState} from "../Facility/get";
import {TAB_PRODUCTIVITY} from '../WorkerDetail/store';
const SELECT_TAB = 'select tab for detail tab';

const LOADING_DATA = "loading of data for some tab"; // should have setted
// for which tab it is and status of loading
const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SET_FILTER = "set filter for some tab";

const LOADING_ADDITIONAL_DATA = "loading of additional data for some tab";
// use same status as LOADING_DATA

const SETTING_OPEN = "open settings";
const SETTING_CLOSE = "close settings";

export const SETTING_PROPERTY_VISIBILITY = "set property visibility";
export const SETTING_PROPERTY_ORDER = "set property order";


const EXPAND_SOMETHING = "expand something";

export function createStore(storeName, getLocalStore, ALL_TABS, tabToSetting,
  tabToApi, tabToAdditionalApi, mergeAdditionalData, getDefaultFilter) {

  function getDefaultFilter(tab) {
    return {
      [ALL_TABS[0]]: new (Record({
        id: null,
      })),
      [ALL_TABS[1]]: new (Record({
        id: null,
        date: null,
      })),
      [ALL_TABS[2]]: new (Record({
        interval: moment.duration(5, 'minutes'),
        window: moment.duration(2, 'hours'),
        endtime: moment(),
        id: null,
      })),
    }[tab]
  }
  // construction of mutable state which we will transform into immutable
  let _initState = {
    tab: ALL_TABS[0], // TAB_DETAIL, TAB_ITEMS, TAB_PICKS
  };

  const dataLoadingState = {
      whatIsLoaded: null, // store what we are loading. Currently idOfItem
                          // null value means nothing is loading
      filter: null,
      data: null,
      error: null,
      whatIsLoading: null,
      loadedTime: null,
      additionalDataLoading: null,
  }

  ALL_TABS.forEach((tab) => {
    _initState[tab] = new (Record({
      ...dataLoadingState,
      expanded: null,
      settings: new (Record({
        properties: new (Record(tabToSetting[tab] ? tabToSetting[tab]: {})),
        open: false,
      })),
    }));
  });


  const initState = new (Record(_initState));
  window.test = initState;

  function detailReducer(state = initState, action) {
    if (action.storeName !== storeName && action.type !== 'REDUX_STORAGE_LOAD') return state;
    switch (action.type) {
      case LOADING_DATA: {
        const {tab} = action;
        switch (action.status) {
          case STATUS_STARTED: {
            const {whatIsLoading} = action;
            return state.mergeIn([tab], new Map({
                data: null,
                error: null,
                whatIsLoading: whatIsLoading,
                whatIsLoaded: null,
                loadedTime: null,
                additionalDataLoading: null,
            }));
          }
          case STATUS_OK: {
            const {data, filter} = action;
            const loadedTime = moment();
            return state.mergeIn([tab], new Map({
                data,
                error: null,
                whatIsLoading: null,
                whatIsLoaded: filter,
                loadedTime,
                additionalDataLoading: null,
            }));
          }
          case STATUS_ERROR: {
            const {error} = action;
            const loadedTime = moment();
            return state.mergeIn([tab], new Map({
                data: null,
                error,
                whatIsLoading: null,
                whatIsLoaded: null,
                loadedTime,
                additionalDataLoading: null,
            }));
          }
        }
      }
      case LOADING_ADDITIONAL_DATA: {
        const {tab} = action;
        switch (action.status) {
          case STATUS_STARTED: {
            const {whatIsLoading: additionalDataLoading} = action;
            return state.mergeIn([tab], new Map({
                additionalDataLoading,
            }));
          }
          case STATUS_OK: {
            const {data} = action;
            const mergedData = mergeAdditionalData[tab](state[tab].data, data);
            return state.mergeIn([tab], new Map({
                data: mergedData,
                additionalDataLoading: null,
            }));
          }
          case STATUS_ERROR: {
            return state.mergeIn([tab], new Map({
                additionalDataLoading: null,
            }));
          }
        }
      }
      case SET_FILTER: {
        const {filter, tab} = action;
        return state.mergeIn([tab, "filter"], fromJS(filter));
      }
      case SETTING_OPEN: {
        const {tab} = action;
        return state.setIn([tab, "settings", "open"], true);
      }
      case SETTING_CLOSE: {
        const {tab} = action;
        return state.setIn([tab, "settings", "open"], false);
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
        return state.setIn([tab, "settings", "properties", "visibility"], newProperties);
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
        return state.setIn([tab, "settings", "properties", "order"], newOrder);
      }
      case EXPAND_SOMETHING: {
        const {what: expanded, tab} = action;
        return state.setIn([tab, "expanded"], expanded);
      }
      case SELECT_TAB: {
        const {tab, itemId} = action;
        if (!state[tab].filter || state[tab].filter.id !== itemId) {
          state = state.setIn([tab, "filter"], new (Record(getDefaultFilter(tab))))
        }
        //if (state[tab].filter.id === itemId) return state;
        return state
                .setIn([tab, "filter", "id"], itemId)
                .setIn(["tab"], tab);
      }
      case 'REDUX_STORAGE_LOAD': {
        try {
          const {payload} = action;
          const savedStorage = getLocalStore(payload);
          let newState = state;
          ALL_TABS.forEach((tab) => {
            newState = newState.mergeIn([tab, "settings", "properties"], new Map(savedStorage[tab]["settings"]["properties"]));
          });
          return newState;
        } catch(e) {
          return state;
        }
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
      return dispatch(acSearch(tab, forceLoad));
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

  function acSetFilter(tab, filter) {
    return {
      type: SET_FILTER,
      tab,
      filter,
      storeName,
    }
  }

  function acSearch(tab, forceLoad) {
    return (dispatch, getState) => {
      const whatIsLoaded = getLocalStore(getState())[tab].whatIsLoaded;
      const filter = getLocalStore(getState())[tab].filter;
      if ((whatIsLoaded === filter) && (!forceLoad)) {
        console.info(`Skip loading order info for ${filter} beacuse is already loaded`);
        return;
      }
      dispatch(search(tab, STATUS_STARTED, {whatIsLoading: filter}));

      const facilityContext = getFacilityContextFromState(getState());
      if (!facilityContext) {
        dispatch(search(tab, STATUS_ERROR, {error: "Want to search for orders but no facility context is provided"}));
        return;
      }

      tabToApi(facilityContext, tab, filter)
      .catch((error) => {
        const whatIsLoading = getLocalStore(getState())[tab].whatIsLoading;
        if (whatIsLoading === filter) {
          console.error(`Error from search for ${storeName}`, error);
          dispatch(search(tab, STATUS_ERROR, {error}));
        }
      })
      .then((data) => {
        const whatIsLoading = getLocalStore(getState())[tab].whatIsLoading;
        if (whatIsLoading === filter) {
          dispatch(search(tab, STATUS_OK, {data, filter}));
        }
      });
    }
  }

  function searchAdditional(tab, status, data) {
    return {
      type: LOADING_ADDITIONAL_DATA,
      tab,
      status,
      storeName,
      ...data
    };
  }

    function acSearchAdditional(tab) {
    return (dispatch, getState) => {
      const filter = getLocalStore(getState())[tab].filter;
      dispatch(searchAdditional(tab, STATUS_STARTED, {whatIsLoading: filter}));

      const facilityContext = getFacilityContextFromState(getState());
      if (!facilityContext) {
        dispatch(searchAdditional(tab, STATUS_ERROR, {error: "Want to search for orders but no facility context is provided"}));
        return;
      }

      tabToAdditionalApi(facilityContext, tab, filter)
      .catch((error) => {
        const additionalDataLoading = getLocalStore(getState())[tab].additionalDataLoading;
        if  (additionalDataLoading === filter) {
          console.error(`Error from search for ${storeName}`, error);
          dispatch(searchAdditional(tab, STATUS_ERROR, {error}));
        }
      })
      .then((data) => {
        const additionalDataLoading = getLocalStore(getState())[tab].additionalDataLoading;
        if  (additionalDataLoading === filter) {
          dispatch(searchAdditional(tab, STATUS_OK, {data, filter}));
        }
      });
    }
  }

  function acSetFilterAndRefresh(filter, itemId, tab) {
    tab = tab || TAB_PRODUCTIVITY;
    return function(dispatch) {
      dispatch(acSetFilter(tab, filter))
      dispatch(acSearch(tab, true))
    }
  }

  return {
    acSetFilter,
    acSetFilterAndRefresh,
    acSearch,
    acSearchAdditional,
    acSelectTab,
    acExpand,
    acSetFieldOrder,
    acSetFieldVisibility,
    acSettingClose,
    acSettingOpen,
    detailReducer,
  };
}