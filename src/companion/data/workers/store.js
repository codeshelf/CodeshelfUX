import * as actions from './actions';
import {Record, List} from 'immutable';
import {register} from 'dispatcher';
import {selectedWorkerCursor, workersCursor} from 'data/state';

import _ from 'lodash';

export const NEWID = "new";
export const Worker = Record(
    {
        "className": "Worker",
        "persistentId": NEWID,
        "middleInitial": null,
        "lastName": null,
        "firstName": null,
        "badgeId": null,
        "hrId": null,
        "groupName": null,
        "updated": null,
        "active": true

    }
);

export const dispatchToken = register(({action, data}) => {

  switch (action) {
    case actions.fetchWorkers:
      if (data) {
          workersCursor((workers) => {
              return _.reduce(data, (list, workerData) =>{
                  return list.push(Worker(workerData));
              }, new List());

          });
      }
      break;
    case actions.addWorker:
          if (data) {
              workersCursor((workerList) => {
                  console.log("Saving ", data);
                  return workerList.push(data);
              });
          }
      break;
    case actions.updateWorker:
        if (data) {
            var id = data.persistentId;
            workersCursor((workerList) => {
                var i = workerList.findIndex((worker) => worker.get("persistentId") === id);
                if (i >= 0) {
                    console.log("Saving ", data, " to ", i);
                    return workerList.set(i, Worker(data));
                }
                else {
                    console.log("worker not found", data);
                }
            });
        }
        break;
  }

});

export function getWorkers() {
    return workersCursor().toJS();
}
