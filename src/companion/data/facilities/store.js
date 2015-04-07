import * as actions from './actions';
import {Range, Record} from 'immutable';
import {register} from 'dispatcher';
import {selectedFacilityCursor} from 'data/state';


// Isomorphic store has to be state-less.
var Facility = Record({domainId: null, persistentId: null});

export const dispatchToken = register(({action, data}) => {

  switch (action) {
    case actions.fetchFacilities:
        if (data && data.length > 0) {
                selectedFacilityCursor((selectedFacility) => Facility(data[0]));
        }
      break;
  }

});

export function getSelectedFacility() {
  return selectedFacilityCursor();
};
