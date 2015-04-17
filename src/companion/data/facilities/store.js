import * as actions from './actions';
import {Range, Record, List} from 'immutable';
import {register} from 'dispatcher';
import {selectedFacilityCursor, facilitiesCursor} from 'data/state';
import _ from 'lodash';

// Isomorphic store has to be state-less.
var Facility = Record({name: null, domainId: null, persistentId: null});

function toFacility(facilityData) {
    facilityData.name = facilityData.domainId; //TODO temporary until name is returned for facility
    return new Facility(facilityData);
}

export const dispatchToken = register(({action, data}) => {
  switch (action) {
      case actions.fetchFacilities:

          if (data) {
              facilitiesCursor((currentFacilities) => {
                  return _.reduce(data, (list, facilityData) => {
                      return list.push(toFacility(facilityData));
                  }, new List());
              });
          }
          break;
      case actions.facilitySelected:
          if (data) {
              selectedFacilityCursor((selectedFacility) => toFacility(data));
          }
          break;
  }

});

export function getFacilities() {
    return facilitiesCursor();
}

export function getSelectedFacility() {
  return selectedFacilityCursor();
};
