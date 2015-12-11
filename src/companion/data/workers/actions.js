import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getFacilityContext} from 'data/csapi';
import _ from 'lodash';
import {selectedWorkerCursor, workersCursor} from 'data/state';


export function fetchWorkers() {
  //set default for this UI at 2000 until paging is handled
  return dispatch(fetchWorkers, getFacilityContext().getWorkers({limit: 2000}));
};

export function addWorker(selectedWorkerForm) {
    return dispatch(addWorker, getFacilityContext().addWorker(selectedWorkerForm.toJS()));
};


export function updateWorker(selectedWorkerForm) {
    return dispatch(updateWorker, getFacilityContext().updateWorker(selectedWorkerForm));
};


// Override actions toString for logging.
setToString('workers', {
   fetchWorkers, addWorker, updateWorker
});
