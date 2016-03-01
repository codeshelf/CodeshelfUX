import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getAPIContext} from 'data/csapi';
import _ from 'lodash';
import {selectedWorkerCursor, workersCursor} from 'data/state';


export function fetchWorkers() {
  //set default for this UI at 2000 until paging is handled
  return dispatch(fetchWorkers, getAPIContext().getWorkers({limit: 2000}));
};

export function addWorker(selectedWorkerForm) {
    return dispatch(addWorker, getAPIContext().addWorker(selectedWorkerForm.toJS()));
};


export function updateWorker(selectedWorkerForm) {
    return dispatch(updateWorker, getAPIContext().updateWorker(selectedWorkerForm));
};


// Override actions toString for logging.
setToString('workers', {
   fetchWorkers, addWorker, updateWorker
});
