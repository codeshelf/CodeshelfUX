import {asMutable} from "pages/Mobile/asMutable";

export function getWorkerSearch(state) {
  const {workerSearch} = state;
  return workerSearch;
}

export const getWorkerSearchMutable = asMutable(getWorkerSearch);