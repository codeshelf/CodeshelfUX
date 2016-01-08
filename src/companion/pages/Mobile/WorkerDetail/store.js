import {getWorkerDetail} from "./get";
import {getWorker, getWorkerHistory, getWorkerHistoryAdditional, getWorkerHistoryWithTime} from "./mockGetWorker";

import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";
import moment from "moment";

export const TAB_DETAIL = "worker tab detail";
export const TAB_HISTORY = "worker tab history";

export const ALL_TABS = [TAB_DETAIL, TAB_HISTORY];

export const PERSIST_STATE_PART = [
  ["workerDetail", TAB_DETAIL, "settings", "properties"],
  ["workerDetail", TAB_HISTORY, "settings", "properties"],
 ];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.headerFieldsSetting,
  [TAB_HISTORY]: fieldSetting.historyFieldsSetting,
};

// TODO optimize for speed
function tabToApi(facilityContext, tab, domainId) {
  const call = {
    //[TAB_DETAIL]: getWorker,
    [TAB_DETAIL]: facilityContext.getWorker,
    [TAB_HISTORY]:  (arg) => {
      if (typeof arg === 'string') {
        // arg is just worker id
        //return getWorkerHistory(arg);
        return facilityContext.getWorkerEvents(arg);
      } else {
        // arg is map with id and filter
        const {id, filter} = arg;
        const endAt = moment(filter, "YYYY/MM/DD HH:mm");
        const startAt = moment(endAt).subtract(1, "M");
        return facilityContext.getWorkerEventsWithTime({id, startAt, endAt});
      }
    },
  }[tab];
  return call(domainId);
}

function tabToAdditionalApi(facilityContext, tab, itemId) {
  const call = {
    [TAB_HISTORY]: facilityContext.getWorkerEventsNext,
  }[tab];
  return call(itemId);
}

const mergeAdditionalData = {
  [TAB_HISTORY]: (oldData, newData) => {
    return {
      ...oldData,
      results: [...oldData.results, ...newData.results],
      next: newData.next,
      prev: newData.prev,
    }
  },
};


const store = createStore("workerDetail", getWorkerDetail,
    ALL_TABS, tabToSetting, tabToApi, tabToAdditionalApi, mergeAdditionalData);

export const workerDetailReducer = store.detailReducer;
export const acSearch = store.acSearch;
export const acSearchAdditional = store.acSearchAdditional;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
export const acSetFilter = store.acSetFilter;