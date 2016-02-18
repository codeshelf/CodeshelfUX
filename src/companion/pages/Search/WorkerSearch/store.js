import {getWorkerSearch} from "./get";
import {getWorkersByBadge} from "./mockGetWorkers.js";
import {createStore} from "../storeFactory";

const MAX_RESULTS = 5;

const simpleProperties = ["badgeId", "updated", "firstName", "lastName"];

function searchApiCall(facilityContext, text) {
  const findWorkers = facilityContext.findWorkers;
  const filterText = text.includes("*")? text : `*${text}*`;
  const filter = {
    properties: simpleProperties,
    badgeId: filterText,
    limit: MAX_RESULTS
  };
  return findWorkers(filter);
  //return getWorkersByBadge(text);
}

const store = createStore("workerSearch", getWorkerSearch, searchApiCall);

export const workerSearchReducer = store.searchReducer;
export const acChangeFilter = store.acChangeFilter;
export const acSearch = store.acSearch;
