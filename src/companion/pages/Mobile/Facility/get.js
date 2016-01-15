// Helpers to extract part of store state from global state
import {asMutable} from "pages/Mobile/asMutable";
import {Record} from 'immutable';

export function getFacility(state) {
  let {facility} = state;
  facility = facility.toObject();
  facility['isOpen'] = state.sidebar.isOpen;
  facility = new (Record(facility));
  return facility;
}

export const getFacilityMutable = asMutable(getFacility);

export function getSelectedFacility({facility: {selectedFacility}}) {
  return selectedFacility;
}

export function getFacilityContextFromState({facility: {facilityContext}}) {
  return facilityContext;
}
