import {selectFirstFacility, selectFacilityByName} from 'data/facilities/actions';
import {getFacilities} from 'data/csapi';

const SET_AVAILABLE_FACILITIES = 'SET_AVAILABLE_FACILITIES';
const LOAD_AVAILABLE_FACILITIES = 'LOAD_AVAILABLE_FACILITIES';
const SELECT_FACILITY = 'SELECT_FACILITY';

const initState = {
  loadingAvailableFacilities: false,
  availableFacilities: null,
  selectedFacility: null,
}

export function facilityReducer(state = initState, action) {
  switch (action.type) {
    case LOAD_AVAILABLE_FACILITIES: {
      return {...state, loadingAvailableFacilities: true}
    }
    case SET_AVAILABLE_FACILITIES: {
      return {...state, availableFacilities: action.data, loadingAvailableFacilities: false};
    }
    case SELECT_FACILITY: {
      // if i don't have facilities i can select one

      const selectedFacility = state.availableFacilities.find((f) => {
        return f.persistentId === action.facilityName;
      });
      if (state.selectedFacility === selectedFacility) return state;
      return {...state, selectedFacility};
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
        dispatch({
          type: SET_AVAILABLE_FACILITIES,
          data
        });
      });
    }
  }
}

export function acSelectFacility(facilityName) {
  return (dispatch, getState) =>{
    const state = getState();
    // don't select facility if same is selected
    if (state.facility.selectedFacility &&
           state.facility.selectedFacility.persistentId === facilityName) {
      console.log("selectFacility already selected")
      return;
    }
    // cant select facility if it's not availible
    if (!state.facility.availableFacilities) {
      console.warn("Want to select " + facilityName + " but no available facilities", state);
      // TODO maybe call initialLoadFacility
      return;
    }
    dispatch({
      type: SELECT_FACILITY,
      facilityName
    });

  }

}