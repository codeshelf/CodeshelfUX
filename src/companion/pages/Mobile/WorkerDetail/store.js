import {getWorkerDetail} from "./get";
import {getWorker, getWorkerHistory, getWorkerHistoryAditional} from "./mockGetWorker";

import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";

export const PERSIST_STATE_PART = [
  ["workerDetail", TAB_DETAIL, "settings", "properties"],
  ["workerDetail", TAB_HISTORY, "settings", "properties"],
 ];

export const TAB_DETAIL = "worker tab detail";
export const TAB_HISTORY = "worker tab history";

export const ALL_TABS = [TAB_DETAIL, TAB_HISTORY];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.headerFieldsSetting,
  [TAB_HISTORY]: fieldSetting.historyFieldsSetting,
};

// TODO optimize for speed
function tabToApi(facilityContext, tab, domainId) {
  const call = {
    //[TAB_DETAIL]: getWorker,
    [TAB_DETAIL]: facilityContext.getWorker,
    [TAB_HISTORY]:  getWorkerHistory,
  }[tab];
  return call(domainId);
}

function tabToAditionalApi(facilityContext, tab, itemId) {
  const call = {
    [TAB_HISTORY]: getWorkerHistoryAditional,
  }[tab];
  return call(itemId);
}

const mergeAditionalData = {
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
    ALL_TABS, tabToSetting, tabToApi, tabToAditionalApi, mergeAditionalData);

export const workerDetailReducer = store.detailReducer;
export const acSearch = store.acSearch;
export const acSearchAditional = store.acSearchAditional;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
