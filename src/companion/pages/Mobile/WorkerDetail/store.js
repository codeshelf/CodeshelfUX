import {getWorkerDetail} from "./get";
import {getWorker, getWorkerHistory} from "./mockGetWorker";

import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";

export const PERSIST_STATE_PART = [
  ["workerDetail", TAB_DETAIL, "settings", "properties"],
  ["workerDetail", TAB_HISTORY, "settings", "properties"],
 ];

export const TAB_DETAIL = "tab detail";
export const TAB_HISTORY = "tab items";

export const ALL_TABS = [TAB_DETAIL, TAB_HISTORY];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.headerFieldsSetting,
  [TAB_HISTORY]: fieldSetting.historyFieldsSetting,
};

// TODO optimize for speed
function tabToApi(facilityContext, tab, domainId) {
  const call = {
    [TAB_DETAIL]: getWorker,
    [TAB_HISTORY]:  getWorkerHistory,
  }[tab];
  return call(domainId);
}

const store = createStore("workerDetail", getWorkerDetail, ALL_TABS, tabToSetting, tabToApi);

export const workerDetailReducer = store.detailReducer;
export const acSearch = store.acSearch;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
