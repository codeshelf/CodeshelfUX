import {getWorkerSearch} from "./get";
import {getWorkersByBadge} from "./mockGetWorkers.js";
import {createStore} from "../Search/storeFactory";

function searchApiCall(facilityContext, text) {
  const filterText = text.includes("*")? text : `*${text}*`;
  return getWorkersByBadge(text);
}

const store = createStore("workerSearch", getWorkerSearch, searchApiCall);

export const workerSearchReducer = store.searchReducer;
export const acChangeFilter = store.acChangeFilter;
export const acSearch = store.acSearch;
