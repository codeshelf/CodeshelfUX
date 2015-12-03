// Helpers to extract part of store state from global state

export function getFacility(state) {
  const {facility} = state;
  return facility;
}

export function getSelectedFacility(state) {
  const {facility: {selectedFacility}} = state;
  return selectedFacility;
}