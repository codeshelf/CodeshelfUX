// Helpers to extract part of store state from global state
import {asMutable} from "pages/asMutable";
import {Record} from 'immutable';

export function getFacility({facility}) {
  return facility;
}

export const getFacilityMutable = asMutable(getFacility);

export function getSelectedFacility({facility: {selected}}) {
  return selected.selectedFacility;
}

export function getSelected({facility: {selected}}) {
  return selected;
}

export function getFacilityContextFromState({facility: {context}}) {
  return context;
}
