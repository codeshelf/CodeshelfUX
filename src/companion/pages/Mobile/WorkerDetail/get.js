import {asMutable} from "pages/Mobile/asMutable";

export function getWorkerDetail(state) {
  const {workerDetail} = state;
  return workerDetail;
}

export const getWorkerDetailMutable = asMutable(getWorkerDetail);