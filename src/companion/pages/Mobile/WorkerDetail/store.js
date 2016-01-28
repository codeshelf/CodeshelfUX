import {getWorkerDetail} from "./get";
import {getWorker, getWorkerHistory, getWorkerHistoryAdditional, getWorkerHistoryWithTime} from "./mockGetWorker";
import Promise from 'bluebird';
import * as fieldSetting from './storeFieldConfig';
import {createStore} from "../Detail/storeFactory";
import moment from "moment";
import {filterToParams} from "../WorkerPickCharts/store";

export const TAB_DETAIL = "worker tab detail";
export const TAB_PRODUCTIVITY = "worker tab productivity";

export const ALL_TABS = [TAB_DETAIL, TAB_PRODUCTIVITY];

export const PERSIST_STATE_PART = [
  ["workerDetail", TAB_DETAIL, "settings", "properties"],
  ["workerDetail", TAB_PRODUCTIVITY, "settings", "properties"],
 ];

const tabToSetting = {
  [TAB_DETAIL]: fieldSetting.headerFieldsSetting,
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
    //[TAB_DETAIL]: getWorker,
    [TAB_DETAIL]:  (filter) => facilityContext.getWorker(filter.id),
    [TAB_PRODUCTIVITY]: (filter) => {
      const endAt = moment(filter.endtime, "YYYY/MM/DD HH:mm");
      const startAt = moment(endAt).subtract(filter.window.asMinutes(), "m");
      return Promise.all([
        facilityContext.getWorkerEventHistogram({id: filter.id, ...filterToParams(filter)}),
        facilityContext.getWorkerEventsWithTime({id: filter.id, startAt, endAt})
      ]).then((res) => { return {histogram: res[0], events: res[1]}})
    },
  }[tab];
  return call(filter);
}

function tabToAdditionalApi(facilityContext, tab, filter) {
  const call = {
    [TAB_PRODUCTIVITY]: facilityContext.getWorkerEventsNext,
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

const store = createStore("workerDetail", getWorkerDetail,
    ALL_TABS, tabToSetting, tabToApi, tabToAdditionalApi, mergeAdditionalData, getDefaultFilter);

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
export const acSetFilterAndRefresh = store.acSetFilterAndRefresh;


function moveGraphToFactory(howToMove) {
  return (dispatch, getState) => {
    const localState = getWorkerDetail(getState())[TAB_PRODUCTIVITY];
    const {endtime: oldEndtime, window} = localState.filter
    const endtime = howToMove(oldEndtime,window);
    dispatch(acSetFilter(TAB_PRODUCTIVITY, {endtime}));
    dispatch(acSearch(TAB_PRODUCTIVITY, localState.filter.id, true));
  }
}

export const acMoveGraphToLeft = () => moveGraphToFactory(
  (end, window) => moment(end).subtract(window));
export const acMoveGraphToRight = () => moveGraphToFactory(
  (end, window) => moment(end).add(window));