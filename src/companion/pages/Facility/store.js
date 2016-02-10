import {getFacilities, getFacilityCustomers} from 'data/csapi';
import {Record, Map} from 'immutable';
import {getSelectedFacility} from "./get";
import {getAPIContext} from 'data/csapi';
import Promise from 'bluebird';
import {getCustomers} from './mockCustomers';

//temp for storing to old store
import {updateSelectedFacility, toFacilityRecord} from 'data/facilities/store';


const SET_AVAILABLE_FACILITIES = 'SET_AVAILABLE_FACILITIES';
const LOAD_AVAILABLE_FACILITIES = 'LOAD_AVAILABLE_FACILITIES';
const SELECT_CONTEXT = 'SELECT_CONTEXT';

const initState = new (Record({
  loadingAvailableFacilities: false,
  availableFacilities: null,
  selected: {
    selectedFacility: null,
    selectedCustomer: null,
  },
  context: null,
}));

export function facilityReducer(state = initState, action) {
  switch (action.type) {
    case LOAD_AVAILABLE_FACILITIES: {
      //return {...state, loadingAvailableFacilities: true}
      return state.set("loadingAvailableFacilities", true);
    }
    case SET_AVAILABLE_FACILITIES: {
      const availableFacilities = action.data;
      //return {...state, availableFacilities, loadingAvailableFacilities: false};
      return state.merge(new Map({availableFacilities, loadingAvailableFacilities: false}));
    }
    case SELECT_CONTEXT: {
      // if i don't have facilities i can select one
      const selectedFacility = state.availableFacilities.find((f) => {
        return f.domainId === action.domainId;
      });
      // we select also customer
      let selectedCustomer = null;
      if (action.customerId !== 'ALL') {
        selectedCustomer = selectedFacility ? selectedFacility.customers.find((c) => {
                return c.domainId === action.customerId;
        }) : null;
      } else {
        selectedCustomer = 'ALL';
      };
      if (state.selected.selectedFacility === selectedFacility && state.selected.selectedCustomer === selectedCustomer) return state;
      const context = getAPIContext({selectedFacility, selectedCustomer});
      updateSelectedFacility(toFacilityRecord(selectedFacility));//old store
      //return {...state, selectedFacility};
      return state.merge(new Map({selected: {selectedFacility: selectedFacility, selectedCustomer: selectedCustomer}, context}));
    }
    default: return state;
  }
}

export function acInitialLoadFacilities() {
  return (dispatch, getState) => {
    const loading = getState().facility.loadingAvailableFacilities;
    if (!loading) {
      dispatch({
        type: LOAD_AVAILABLE_FACILITIES,
      });
      getFacilities().then((data) => {
        Promise.all(data.map((facility) => getCustomers(facility.domainId)))
          .then((customersData) => {
              data = data.map((facility, index) => {
                facility['customers'] = customersData[index].results;
                return facility;
              });
              dispatch({
                type: SET_AVAILABLE_FACILITIES,
                data,
              });
          });
      });
    }
  }
}

export function acSelectContext({domainId, customerId}) {
  return (dispatch, getState) =>{
    const state = getState();
    // don't select facility if same is selected
    if (state.facility.selected.selectedFacility &&
        state.facility.selected.selectedFacility.domainId === domainId &&
        state.facility.selected.selectedCustomer &&
        (state.facility.selected.selectedCustomer === customerId || state.facility.selected.selectedCustomer.domainId === customerId)) {
      console.log("selectFacility already selected")
      return;
    }
    // cant select facility if it's not availible
    if (!state.facility.availableFacilities) {
      console.warn("Want to select " + domainId + " but no available facilities", state);
      // TODO maybe call initialLoadFacility
      return;
    }
    dispatch({
      type: SELECT_CONTEXT,
      domainId,
      customerId,
    });

  }

}
