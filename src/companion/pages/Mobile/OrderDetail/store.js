import {getFacilityContext} from 'data/csapi';
import {getSelectedFacility} from "../Facility/store";

const LOADING_STARTED = "loading_of_order_detail_started";
const LOADING_OK = "loading_of_order_detail_ok";
const LOADING_ERROR = "loading_of_order_detail_error";


const initState = {
  whatIsLoading: null, // store what we are loading. Currently idOfItem
                       // null value means nothing is loading
  error: null,
  order: null,
};

export function getOrderDetail(state) {
  return state.orderDetail;
}

export function orderDetailReducer(state = initState, action) {
  switch (action.type) {
    case LOADING_STARTED: {
      console.log("!!!!!!! orderSearchReducer started !!!!");
      const {whatIsLoading} = action;
      let s = {...state, order: null, error: null, whatIsLoading: whatIsLoading}
      console.log(s);
      return s;
    }
    case LOADING_OK: {
      console.log("!!!!!!! LOADING_OK !!!!");
      const {order} = action;
      return {...state, order, error: null, whatIsLoading: null};
    }
    case LOADING_ERROR: {
      const {error} = action;
      return {...state, order: null, error, whatIsLoading: null};
    }
    default: return state;
  }
}

function searchStated(whatIsLoading) {
  return {
    type: LOADING_STARTED,
    whatIsLoading,
  };
}

function searchOk(order) {
  return {
    type: LOADING_OK,
    order,
  };
}

function searchError(error) {
  return {
    type: LOADING_ERROR,
    error,
  };
}

export function acSearch(orderId) {
  return (dispatch, getState) => {
    dispatch(searchStated(orderId));
    const selectedfacility = getSelectedFacility(getState());
    if (!selectedfacility || !(selectedfacility.persistentId)) {
      dispatch(searchError("Want to search for orders but no facility is provided"));
      return;
    }
    const getOrderDetails = getFacilityContext(selectedfacility.persistentId).getOrderDetails;

    getOrderDetails(orderId).then((data) => {
      // Check if i should dispach or other search has been issued
      const orderSearch = getOrderDetail(getState());
      if (orderSearch.whatIsLoading === orderId) {
        dispatch(searchOk(data));
      }
    }).catch((e) => {
      console.log("Error from search orders", e);
      // Check if i should dispach
      dispatch(searchError(e));
    });
  }

}
