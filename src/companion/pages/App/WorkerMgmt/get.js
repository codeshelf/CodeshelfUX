import {asMutable} from "pages/asMutable";

export function getWorkerMgmt({workerMgmt}) {
  return workerMgmt;
}

export const getWorkerMgmtMutable = asMutable(getWorkerMgmt);
