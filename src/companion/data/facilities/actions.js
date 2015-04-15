import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getFacilities} from 'data/csapi';
import _ from 'lodash';

export function fetchFacilities() {
    dispatch(fetchFacilities, getFacilities());
}


export function facilitySelected(facility) {
    dispatch(facilitySelected, facility);
}

export function selectFacilityByName(name) {
    getFacilities().done((facilities) => {
        let facility = _.find(facilities, "domainId", name);
        if (facility) {
            dispatch(facilitySelected, facility);
        } else {
            throw `no matching facility for ${name}`;
        }
    });
};


export function selectFirstFacility() {
    getFacilities().done((facilities) => {
        if (facilities && facilities.length > 0) {
            dispatch(facilitySelected, facilities[0]);
        }
        else {
            throw "no facilities available";
        }
    });
};


// Override actions toString for logging.
setToString('facilities', {
  fetchFacilities, selectFirstFacility, selectFacilityByName, facilitySelected
});
