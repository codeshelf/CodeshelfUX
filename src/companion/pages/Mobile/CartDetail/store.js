import {getCartDetail} from "./get";
import Promise from 'bluebird';
import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";
import moment from "moment";
import {filterToParams} from "../WorkerPickCharts/store";

export const TAB_DETAIL = "cart tab detail";
export const TAB_PRODUCTIVITY = "cart tab productivity";

export const ALL_TABS = [TAB_DETAIL, TAB_PRODUCTIVITY];

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

const store = createStore("cartDetail", getCartDetail,
    ALL_TABS, tabToSetting, tabToApi, tabToAdditionalApi, mergeAdditionalData, getDefaultFilter);

export const cartDetailReducer = store.detailReducer;
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
