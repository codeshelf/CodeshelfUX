import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility} from "../Facility/get";
import {getOrderSearch} from "./get";

const FILTER_CHANGE = "filterChange";
const LOADING_STARTED = "loading_of_orders_started";
const LOADING_OK = "loading_of_orders_ok";
const LOADING_ERROR = "loading_of_orders_error";


const initState = {
  filter: {
    text: null, //if we show filter first time we need
              // to distinguish between empty string filter and not inicialized
  },
  whatIsLoading: null, // store what we are loading. Currently text of filter
                       // null value means nothing is loading
  error: null,
  orders : null,

};


export function orderSearchReducer(state = initState, action) {
  switch (action.type) {
    case FILTER_CHANGE: {
      const {text} = action;
      return {...state, filter: {...state.filter, text}};
    }
    case LOADING_STARTED: {
      const {whatIsLoading} = action;
      return {...state, orders: null, error: null, whatIsLoading: whatIsLoading}
    }
    case LOADING_OK: {
      const {orders} = action;
      return {...state, orders, error: null, whatIsLoading: null};
    }
    case LOADING_ERROR: {
      const {error} = action;
      return {...state, orders: null, error, whatIsLoading: null};
    }
    default: return state;
  }
}


function filterChange(text) {
  return {
    type: FILTER_CHANGE,
    text,
  };
}

export function acChangeFilter(newFilterText) {
  return (dispach) => {
    dispach(filterChange(newFilterText));
    dispach(acSearch(newFilterText));
  };
}


function searchStated(whatIsLoading) {
  return {
    type: LOADING_STARTED,
    whatIsLoading,
  };
}

function searchOk(orders) {
  return {
    type: LOADING_OK,
    orders,
  };
}

function searchError(error) {
  return {
    type: LOADING_ERROR,
    error,
  };
}

// all avalible properties
const properties = ["persistentId", "orderId", "customerId", "shipperId", "destinationId", "containerId",
    "status", "orderLocationAliasIds", "groupUi", "active", "fullDomainId", "wallUi", "orderType", "dueDate", "orderDate"];
// proprties for search
const simpleProperties = ["orderId", "dueDate", "status"];

export function acSearch(text) {
  return (dispatch, getState) => {
    dispatch(searchStated(text));
    const selectedfacility = getSelectedFacility(getState());
    if (!selectedfacility || !(selectedfacility.persistentId)) {
      dispatch(searchError("Want to search for orders but no facility is provided"));
      return;
    }
    const findOrders = getFacilityContext(selectedfacility.persistentId).findOrders;
    const filterText = text.includes("*")? text : `*${text}*`;
    const filter = {
      properties: simpleProperties,
      orderId: filterText,
    }
    findOrders(filter).then((data) => {
      console.log("data from search orders", data);
      // Check if i should dispach or other search has been issued
      const orderSearch = getOrderSearch(getState());
      if (orderSearch.whatIsLoading === text) {
        dispatch(searchOk(data));
      }
    }).catch((e) => {
      console.log("error from search orders", e);
      // Check if i should dispach
      dispatch(searchError(e));
    });
  }

}
