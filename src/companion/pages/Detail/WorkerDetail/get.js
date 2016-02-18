import {asMutable} from "pages/asMutable";

export function getWorkerDetail(state) {
  const {workerDetail} = state;
  return workerDetail;
}

export const getWorkerDetailMutable = asMutable(getWorkerDetail);