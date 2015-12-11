import {getOrderDetail} from "./get";
import {getPicks} from "./mockGetPicks";

import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";

export const PERSIST_STATE_PART = [
  ["orderDetail", TAB_DETAIL, "settings", "properties"],
  ["orderDetail", TAB_ITEMS, "settings", "properties"],
  ["orderDetail", TAB_PICKS, "settings", "properties"],
  ["orderDetail", TAB_IMPORTS, "settings", "properties"],
 ];

export const TAB_DETAIL = "tab detail";
export const TAB_ITEMS = "tab items";
export const TAB_PICKS = "tab picks";
export const TAB_IMPORTS = "tab imports";

export const ALL_TABS = [TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.headerFieldsSetting,
  [TAB_ITEMS]: fieldSetting.itemsFieldsSetting,
  [TAB_PICKS]: fieldSetting.picksFieldsSetting,
  [TAB_IMPORTS]: fieldSetting.importFieldsSetting,
};

// all avalible properties for order detail
const orderDetailProperties = ["persistentId", "orderId", "customerId", "shipperId", "destinationId", "containerId",
    "status", "orderLocationAliasIds", "groupUi", "active", "fullDomainId", "wallUi", "orderType", "dueDate", "orderDate"];

const MILISECONDS_IN_MONTH = 1000*60*60*24*31;

// TODO optimize for speed
function tabToApi(facilityContext, tab, orderId) {
  const call = {
    [TAB_DETAIL]: (orderId) => facilityContext.getOrder(orderDetailProperties, orderId),
    [TAB_ITEMS]:  facilityContext.getOrderDetails,
    //[TAB_PICKS]: getPicks,
    [TAB_PICKS]: facilityContext.getOrderEvents,
    [TAB_IMPORTS]: (orderId) => {
      const nowTime = new Date();
      const monthBefore = new Date();
      monthBefore.setTime(nowTime.getTime()-MILISECONDS_IN_MONTH);
      return facilityContext.findImportReceipts({
        orderIds: orderId,
        itemIds: "",
        gtins: "",
        properties: ["orderId"],
        received: `${monthBefore.toISOString()}/${nowTime.toISOString()}`
      })
    }
  }[tab];
  return call(orderId);
}

const store = createStore("orderDetail", getOrderDetail, ALL_TABS, tabToSetting,  tabToApi);

export const orderDetailReducer = store.detailReducer;
export const acSearch = store.acSearch;
export const acSelectTab = store.acSelectTab;
export const acExpand = store.acExpand;
export const acSetFieldOrder = store.acSetFieldOrder;
export const acSetFieldVisibility = store.acSetFieldVisibility;
export const acSettingClose = store.acSettingClose;
export const acSettingOpen = store.acSettingOpen;
