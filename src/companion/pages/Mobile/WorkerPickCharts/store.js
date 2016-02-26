import moment from "moment";
import _ from "lodash";
import {Map, Record} from 'immutable';
import {getWorkerPickChart} from "./get";

import {getFacilityContextFromState} from "../../Facility/get";

import {getWorkerPickCharts, getWorkerPickByWorker} from "./mockGetWorkerPickCharts";

const initState = new (Record({
  whatIsLoaded: null, // store what we are loading. Currently idOfItem
                      // null value means nothing is loading
  filter: null,
  data: null,
  error: null,
  whatIsLoading: null,
  loadedTime: null,
  purposes: {
    data: null,
    error: null,
    loading: null,
  },
}));

function getDefaultFilter() {
  return new (Record({
    interval: moment.duration(5, 'minutes'),
    window: moment.duration(2, 'hours'),
    endtime: moment(),
    purposes: [],
  }));
}

const LOADING_DATA = "WPCH - loading";
const STATUS_STARTED = "started";
const STATUS_OK = "ok";
const STATUS_ERROR = "error";

const SET_FILTER = "WPCH - set filter ";
const TOGGLE_EXPAND = "toggle expand";

const LOADING_PURPOSES = "loding purposes";

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
    case LOADING_PURPOSES: {
      switch (action.status) {
        case STATUS_STARTED: {
          return state.merge(new Map({
              purposes: {
                data: null,
                error: null,
                loading: true,
              },
          }));
        }
        case STATUS_OK: {
          const {data, filter} = action;
          return state.merge(new Map({
              purposes: {
                data: data.purposes,
                error: null,
                loading: false,
              }
          }));
        }
        case STATUS_ERROR: {
          const {error} = action;
          const loadedTime = moment();
          return state.merge(new Map({
            purposes: {
              data: null,
              error: error,
              loading: false,
            },
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
    default: return state;
  }
}

export function acSetDefaultFilter() {
  return (dispatch, getState) => {
    dispatch(acSetFilter(getDefaultFilter()));
    dispatch(acSearch(true));
  }
}

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

export function filterToParams({endtime, window, interval, purposes}) {
  return {
    startAt: moment(endtime).subtract(window),
    endAt: endtime,
    interval: interval,
    purposes: purposes,
  }
}

function getPurposes(status, data) {
  return {
    type: LOADING_PURPOSES,
    status,
    ...data,
  }
}

export function acGetPurposes() {
  return (dispatch, getState) => {
    const localState = getWorkerPickChart(getState());
    const {purposes: {data}} = localState;
    if (data) {
      console.info(`Skip loading purposes beacuse they are already loaded`);
      return;
    }
    dispatch(getPurposes(STATUS_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getPurposes(STATUS_ERROR));
      return;
    }

    facilityContext.getEventPurposes()
    .catch((error) => {
        dispatch(getPurposes(STATUS_ERROR));
    })
    .then((data) => {
        dispatch(getPurposes(STATUS_OK, {data}));
    });
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
