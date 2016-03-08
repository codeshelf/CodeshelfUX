import {Map, Record, fromJS, List} from 'immutable';
import {getFacilityContextFromState} from "../../Facility/get";

export const NEWID = "new";
const GET_WORKERS = 'GET_WORKERS';
const UPDATE_WORKER = 'UPDATE_WORKER';
const ADD_WORKER = 'ADD_WORKER';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_OK = 'LOADING_OK';
const LOADING_ERROR = 'LOADING_ERROR';
const STORE_WORKER_FORM = 'STORE_WORKER_FORM';
const UPDATE_WORKER_FORM = 'UPDATE_WORKER_FORM';

const initState = new (Record({
  workers: new Map({
    data: [],
    error: null,
    loading: null,
  }),
  addWorker: new Map({
    loading: null,
    error: null,
  }),
  updateWorker: new Map({
    data: null,
    loading: null,
    error: null,
  }),
  selectedWorkerForm: null,
}));

export function workerMgmtReducer(state = initState, action) {
  switch (action.type) {
    case GET_WORKERS: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['workers'], new Map({
            data: [],
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          return state.mergeIn(['workers'], new Map({
            data: action.data.results,
            loading: null,
            error: null,
          }));
        }
        case LOADING_ERROR: {
          return state.mergeIn(['workers'], new Map({
            data: [],
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case UPDATE_WORKER: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['updateWorker'], new Map({
            data: null,
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.workers.get('data');
          const newData = data.map((worker) => {
            if (worker.persistentId == action.data.persistentId) {
              return action.data;
            }
            return worker;
          })
          return state.merge({
            updateWorker: {
              data: action.data,
              loading: null,
              error: null,
            },
            workers: {...state.workers, data: newData}
          });
        }
        case LOADING_ERROR: {
          return state.mergeIn(['updateWorker'], new Map({
            data: null,
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case ADD_WORKER: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['addWorker'], new Map({
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.workers.get('data');
          data.push(action.data);
          return state.merge(new (Record({
          addWorker: {
            loading: null,
            error: null,
          },
          workers: new Map({...state.workers, data})
          })));
        }
        case LOADING_ERROR: {
          return state.mergeIn(['addWorker'], new Map({
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case STORE_WORKER_FORM: {
      return state.set('selectedWorkerForm', action.workerForm);
    }
    case UPDATE_WORKER_FORM: {
      return state.setIn(['selectedWorkerForm', action.fieldName], action.value);
    }
    default: return state;
  }
}

function setStatus(type, status, data) {
  return {
    type,
    status,
    data
  };
}

export function acStoreSelectedWorkerForm(workerForm) {
  return {
    type: STORE_WORKER_FORM,
    workerForm,
  }
}

export function acGetWorkers({limit}) {
  return (dispatch, getState) => {
    dispatch(setStatus(GET_WORKERS, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to get workers but no facility context is provided`));
      return;
    }

    facilityContext.getWorkers({limit}).then((data) => {
      console.log(`data from getWorkers`, data);
      dispatch(setStatus(GET_WORKERS, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from getting workers`, e);
      dispatch(setStatus(GET_WORKERS, LOADING_ERROR, e));
    });
  }
}

export function acUpdateSelectedWorker(fieldName, value) {
  return {
    type: UPDATE_WORKER_FORM,
    fieldName,
    value,
  }
}

export function acUpdateWorker(selectedWorkerForm) {
  return (dispatch, getState) => {
    dispatch(setStatus(UPDATE_WORKER, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to update worker but no facility context is provided`));
      return;
    }

    return facilityContext.updateWorker(selectedWorkerForm.toJS()).then((data) => {
      console.log(`data from updateWorker`, data);
      dispatch(setStatus(UPDATE_WORKER, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from updating worker`, e);
      dispatch(setStatus(UPDATE_WORKER, LOADING_ERROR, e));
    });
  }
}

export function acAddWorker(selectedWorkerForm) {
  return (dispatch, getState) => {
    dispatch(setStatus(ADD_WORKER, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to update worker but no facility context is provided`));
      return;
    }

    return facilityContext.addWorker(selectedWorkerForm.toJS()).then((data) => {
      console.log(`data from updateWorker`, data);
      dispatch(setStatus(ADD_WORKER, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from updating worker`, e);
      dispatch(setStatus(ADD_WORKER, LOADING_ERROR, e));
    });
  }
}

export function acHandleImport({method, formData}){
  return (dispatch, getState) => {
    dispatch(setStatus(GET_WORKERS, LOADING_STARTED));

    const facilityContext = getFacilityContextFromState(getState());
    if (!facilityContext) {
      dispatch(getError(`Want to import file but no facility context is provided`));
      return;
    }

    facilityContext[method](formData).then(() => {
      console.log(`import file finish OK`);
      acGetWorkers({limit: 5000});
    }).catch((e) => {
      console.log(`error from file import`, e);
      dispatch(setStatus(GET_WORKERS, LOADING_ERROR, e));
    });
  }
}
