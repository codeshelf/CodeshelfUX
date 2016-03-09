import {Map, Record, fromJS, List} from 'immutable';

import {getFacilityContextFromState} from "../../Facility/get";
import {createStore} from '../ListManagement/storeFactory';

const getDataFormat = (data) => {
  return data.results;
}

const store = createStore({
                          storeName: "workers", 
                          getItems: "getWorkers",
                          addItem: "addWorker",
                          updateItem: "updateWorker",
                          useFacility: true,
                          getDataFormat
                          });

export const acUpdateSelectedWorker = store.acUpdateForm;
export const acStoreSelectedWorkerForm = store.acStoreForm;
export const acGetWorkers = store.acLoadItems;
export const acAddWorker = store.acAddItem;
export const acUpdateWorker = store.acUpdateItem;
export const acUnsetError = store.acUnsetError;
export const workerMgmtReducer = store.listReducer;
export const NEWID = "new";

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
