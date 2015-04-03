import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getFacilities} from 'data/csapi';

export function fetchFacilities() {
  dispatch(fetchFacilities, getFacilities()).fail(() => needAuth());
}

function needAuth() {

}

// Override actions toString for logging.
setToString('facilities', {
  fetchFacilities
});
