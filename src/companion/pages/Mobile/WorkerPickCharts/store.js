import moment from "moment";
import _ from "lodash";
import {Map, Record} from 'immutable';
import {getWorkerPickChart} from "./get";

import {getFacilityContextFromState} from "../Facility/get";

import {getWorkerPickCharts, getWorkerPickByWorker} from "./mockGetWorkerPickCharts";

const initState = new (Record({
  whatIsLoaded: null, // store what we are loading. Currently idOfItem
                      // null value means nothing is loading
  filter: null,
  data: null,
  error: null,
  whatIsLoading: null,
  loadedTime: null,
  expanded: false,
}));

function getDefaultFilter() {
  return new (Record({
    interval: moment.duration(5, 'minutes'),
    window: moment.duration(2, 'hours'),
    endtime: moment(),
  }));
}

const LOADING_DATA = "WPCH - loading";
const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SET_FILTER = "WPCH - set filter ";
const TOGGLE_EXPAND = "toggle expand";

export function workerPickChartReducer(state = initState, action) {
  switch (action.type) {
    case LOADING_DATA: {
      switch (action.status) {
        case STATUS_STARTED: {
          const {whatIsLoading} = action;
          return state.merge(new Map({
              data: null,
              error: null,
              whatIsLoading: whatIsLoading,
              whatIsLoaded: null,
              loadedTime: null,
          }));
        }
        case STATUS_OK: {
          const {data, filter} = action;
          const loadedTime = moment();
          return state.merge(new Map({
              data,
              error: null,
              whatIsLoading: null,
              whatIsLoaded: filter,
              loadedTime,
          }));
        }
        case STATUS_ERROR: {
          const {error} = action;
          const loadedTime = moment();
          return state.merge(new Map({
              data: null,
              error,
              whatIsLoading: null,
              whatIsLoaded: null,
              loadedTime,
          }));
        }
      }
    }
    case SET_FILTER: {
      const {filter} = action;
      if (!state.filter) {
        state = state.set("filter", getDefaultFilter());
      }
      return state.mergeIn(["filter"], new Map(filter));
    }
    case TOGGLE_EXPAND: {
      return state.set("expanded", !state.expanded);
    }
    default: return state;
  }
}

export function acSetDefaultFilter() {
  return (dispatch, getState) => {
    dispatch(acSetFilter(getDefaultFilter()));
    dispatch(acSearch(true));
  }
}

export function acToggleExpand() {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_EXPAND,
    })
  }
}

function moveGraphToFactory(howToMove) {
  return (dispatch, getState) => {
    const localState = getWorkerPickChart(getState());
    const {endtime: oldEndtime, window} = localState.filter
    const endtime = howToMove(oldEndtime,window);
    dispatch(acSetFilter({endtime}));
    dispatch(acSearch(true));
  }
}

export const acMoveGraphToLeft = () => moveGraphToFactory(
  (end, window) => moment(end).subtract(window));
export const acMoveGraphToRight = () => moveGraphToFactory(
  (end, window) => moment(end).add(window));


export function acSetFilter(filter) {
  return {
    type: SET_FILTER,
    filter,
  }
}

export function acRefresh() {
  return (dispatch) => {
    dispatch(acSetFilter({endtime: moment()}));
    dispatch(acSearch(true));
  }
}

export function acSetFilterAndRefresh(filter) {
  return function(dispatch) {
    dispatch(acSetFilter(filter))
    dispatch(acSearch(true))
  }
}

function search(status, data) {
  return {
    type: LOADING_DATA,
    status,
    ...data
  };
}

function filterToParams({endtime, window, interval}) {
  return {
    startAt: moment(endtime).subtract(window),
    endAt: endtime,
    interval: interval,
  }
}

export function acSearch(forceLoad) {
  return (dispatch, getState) => {
    const localState = getWorkerPickChart(getState());
    const {whatIsLoaded, filter} = localState;
    if ((whatIsLoaded === filter) && (!forceLoad)) {
      console.info(`Skip loading worker pick chart info for ${filter} beacuse is already loaded`);
      return;
    }
    dispatch(search(STATUS_STARTED, {whatIsLoading: filter}));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(search(STATUS_ERROR, {error: "Want to search for worker pick chart but no facility context is provided"}));
      return;
    }

    // make api call
    Promise.all([
      //getWorkerPickCharts(filter),
      facilityContext.getWorkerPicksWithnWindow(filterToParams(filter)),
      //getWorkerPickByWorker(filter)
      facilityContext.getWorkerPicksWithnWindowAllWorkers(filterToParams(filter)).then((result) => {
        result.sort((a,b) => {
           return (a.events.total -  b.events.total) * -1; //descending
        });
        return result;
      }),
    ])
    .catch((error) => {
      const whatIsLoading = getWorkerPickChart(getState()).whatIsLoading;
      if (whatIsLoading === filter) {
        console.error(`Error from search for worker pick chart`, error);
        dispatch(search(STATUS_ERROR, {error}));
      }
    })
    .then((data) => {
      const whatIsLoading = getWorkerPickChart(getState()).whatIsLoading;
      if (whatIsLoading === filter) {
        dispatch(search(STATUS_OK, {data, filter}));
      }
    });
  }
}
