import {getCartDetail} from "./get";
import Promise from 'bluebird';
import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";
import moment from "moment";
import {Record, Map} from "immutable";
import {filterToParams} from "../WorkerPickCharts/store";
import {getFacilityContextFromState} from "../Facility/get";

export const TAB_DETAIL = "cart tab detail";
export const TAB_PRODUCTIVITY = "cart tab productivity";
export const TAB_ACTIONS = "cart tab actions";

export const ALL_TABS = [TAB_DETAIL, TAB_PRODUCTIVITY, TAB_ACTIONS];

export const PERSIST_STATE_PART = [
  ["cartDetail", TAB_DETAIL, "settings", "properties"],
  ["cartDetail", TAB_PRODUCTIVITY, "settings", "properties"],
 ];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.detailFieldsSetting,
  [TAB_PRODUCTIVITY]: fieldSetting.historyFieldsSetting,
};

function getDefaultFilter(tab) {
    return {
      [TAB_DETAIL]: {
        id: null,
      },
      [TAB_PRODUCTIVITY]: {
        interval: moment.duration(5, 'minutes'),
        window: moment.duration(2, 'hours'),
        endtime: moment(),
        id: null,
      },
      [TAB_ACTIONS]: {
        id: null,
      },
    }[tab]
  }

// TODO optimize for speed
function tabToApi(facilityContext, tab, filter) {
  const call = {
    //[TAB_DETAIL]: getCart,
    [TAB_DETAIL]:  (filter) => facilityContext.getChe(filter.id),
    [TAB_PRODUCTIVITY]: (filter) => {
      const endAt = moment(filter.endtime, "YYYY/MM/DD HH:mm");
      const startAt = moment(endAt).subtract(filter.window.asMinutes(), "m");
      return Promise.all([
        facilityContext.getCheEventHistogram({id: filter.id, ...filterToParams(filter)}),
        facilityContext.getCheEventsWithTime({id: filter.id, startAt, endAt})
      ]).then((res) => { return {histogram: res[0], events: res[1]}})
    },
    [TAB_ACTIONS]: (filter) => {return Promise.resolve();}
  }[tab];
  return call(filter);
}

function tabToAdditionalApi(facilityContext, tab, filter) {
  const call = {
    [TAB_PRODUCTIVITY]: facilityContext.getCheEventsNext,
  }[tab];
  return call(filter);
}

const mergeAdditionalData = {
  [TAB_PRODUCTIVITY]: (oldData, newData) => {
    return {
      ...oldData,
      events: {
        results: [...oldData.events.results, ...newData.results],
        next: newData.next,
        prev: newData.prev,
      }
    }
  },
};

const initState = new(Record({
  cartAction: new(Record({
    name: null,
    running: false,
    error: null
  }))
}));


const ACTION_ERROR = "cart action error";
const ACTION_OK = "cart action ok";
const ACTION_STARTED = "cart action started";


function cartActionReducer(state = initState, action) {
  switch(action.type) {
    case ACTION_ERROR: {
      const {error} = action;
      return state.mergeIn(['cartAction'], new Map({
        running: false,
        error
      }));
    }
    case ACTION_OK: {
      return state.mergeIn(['cartAction'], new Map({
        running: false,
        error: null
      }));
    }
    case ACTION_STARTED: {
      return state.mergeIn(['cartAction'], new Map({
        name: action.name,
        running: true,
        error: null
      }));
    }
    default: return state;
  }
}

export function acCartAction(domainId, cartAction) {
  return (dispatch, getState) => {
    dispatch({type: ACTION_STARTED, cartAction});
    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch({type:  ACTION_ERROR, cartAction, error: "Want to perform cart action but no facility context is provided"});
      return;
    }
    facilityContext.executeCheAction(domainId, cartAction)
      .catch((e) => {
        dispatch({type:  ACTION_ERROR, cartAction, error: e});
      })
      .then((data) => {
        dispatch({type:  ACTION_OK, cartAction});
      });
  };
}

const store = createStore("cartDetail", getCartDetail,
    ALL_TABS, tabToSetting, tabToApi, tabToAdditionalApi, mergeAdditionalData, getDefaultFilter);

export const cartDetailReducer = (state, action) => {
  return cartActionReducer(store.detailReducer(state, action), action);
};
export const acSearch = store.acSearch;
export const acSearchAdditional = store.acSearchAdditional;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
export const acSetFilter = store.acSetFilter;
export const acSetFilterAndRefresh = store.acSetFilterAndRefresh;
