// Helpers to extract part of store state from global state
import {asMutable} from "pages/Mobile/asMutable";

export function getFacility({facility}) {
  return facility;
}

export const getFacilityMutable = asMutable(getFacility);

export function getSelectedFacility({facility: {selectedFacility}}) {
  return selectedFacility;
}

export function getFacilityContextFromState({facility: {facilityContext}}) {
  return facilityContext;
}
