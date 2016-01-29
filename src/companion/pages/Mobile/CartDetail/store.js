import {getCartDetail} from "./get";
import {getCart} from "./getMockedData";

import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";

export const TAB_CART = "tab cart";
export const TAB_HISTORY = "tab history";

export const ALL_TABS = [TAB_CART, TAB_HISTORY];

export const PERSIST_STATE_PART = [
  ["cartDetail", TAB_CART, "settings", "properties"],
  ["cartDetail", TAB_HISTORY, "settings", "properties"],
];

const tabToSetting = {
  [TAB_CART]: fieldSetting.cartFieldsSetting,
  [TAB_HISTORY]: fieldSetting.historyFieldsSetting,
};

function tabToApi(facilityContext, tab, domainId) {
  const call = {
    //[TAB_CART]: getCart,
    [TAB_CART]: (domainId) => facilityContext.getChe(domainId),
    [TAB_HISTORY]: (domainId) => facilityContext.getCheEvents(domainId),
  }[tab];
  return call(domainId);
}

const store = createStore("cartDetail", getCartDetail, ALL_TABS, tabToSetting,  tabToApi);

export const cartDetailReducer = store.detailReducer;
export const acSearch = store.acSearch;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
export const acSetFilter = store.acSetFilter;