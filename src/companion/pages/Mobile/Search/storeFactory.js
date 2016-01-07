import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility, getFacilityContextFromState} from "../Facility/get";

import {Map, Record} from 'immutable';

export function createStore(storeName, getLocalStore, searchApiCall) {

  const FILTER_CHANGE = "filterChange";
  const LOADING_STARTED = "loading_started";
  const LOADING_OK = "loading_of_ok";
  const LOADING_ERROR = "loading_of_error";


  const initState = new (Record({
    filter: new (Record({
      text: "", //if we show filter first time we need
                // to distinguish between empty string filter and not inicialized
    })),
    whatIsLoading: null, // store what we are loading. Currently text of filter
                        // null value means nothing is loading
    error: null,
    result : null, //result object {total: ... results: ...}

  }));


  function searchReducer(state = initState, action) {
    if (action.storeName !== storeName) return state;
    switch (action.type) {
      case FILTER_CHANGE: {
        const {text} = action;
        //return {...state, filter: {...state.filter, text}};
        return state.setIn(["filter", "text"], text);
      }
      case LOADING_STARTED: {
        const {whatIsLoading} = action;
        //return {...state, result: null, error: null, whatIsLoading: whatIsLoading}
        return state.merge({result: null, error: null, whatIsLoading: whatIsLoading})
      }
      case LOADING_OK: {
        const {result} = action;
        console.log("???", result);
        //return {...state, result, error: null, whatIsLoading: null};
        const tmp =  state.merge(new Map({result, error: null, whatIsLoading: null}));
        console.log("???", tmp.result);
        return tmp;
      }
      case LOADING_ERROR: {
        const {error} = action;
        //return {...state, result: null, error, whatIsLoading: null};
        return state.merge({result: null, error, whatIsLoading: null});
      }
      default: return state;
    }
  };

  function searchStated(whatIsLoading) {
    return {
      type: LOADING_STARTED,
      whatIsLoading,
      storeName,
    };
  }

  function searchOk(result) {
    return {
      type: LOADING_OK,
      result,
      storeName,
    };
  }

  function searchError(error) {
    return {
      type: LOADING_ERROR,
      error,
      storeName,
    };
  }

  function acSearch(text) {
    return (dispatch, getState) => {
      dispatch(searchStated(text));
      const selectedfacility = getSelectedFacility(getState());
      if (!selectedfacility || !(selectedfacility.persistentId)) {
        dispatch(searchError(`Want to search for ${storeName} for but no facility is provided`));
        return;
      }
      const facilityContext = getFacilityContextFromState(getState());
      searchApiCall(facilityContext, text).then((data) => {
        console.log(`data from search ${storeName}`, data);
        // Check if i should dispach or other search has been issued
        const localStorePart = getLocalStore(getState());
        if (localStorePart.whatIsLoading === text) {
          dispatch(searchOk(data));
        }
      }).catch((e) => {
        console.log(`error from search ${storeName}`, e);
        // Check if i should dispach
        dispatch(searchError(e));
      });
    }
  }


  function filterChange(text) {
    return {
      type: FILTER_CHANGE,
      text,
      storeName,
    };
  }


  function acChangeFilter(newFilterText) {
    return (dispatch) => {
      dispatch(filterChange(newFilterText));
      dispatch(acSearch(newFilterText));
    };
  }

  return {
    searchReducer,
    acChangeFilter,
    acSearch,
  };
}
