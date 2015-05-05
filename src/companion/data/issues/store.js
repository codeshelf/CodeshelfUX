import * as actions from './actions';
import {Range, Record, List, fromJS} from 'immutable';
import {register} from 'dispatcher';
import {selectedIssueCursor, state} from 'data/state';
import _ from 'lodash';

export const IssueEvent = Record({
    persistentId: null,
    eventTimestamp: null,
    resolvedTimestamp: null,
    resolvedBy: null,
    orderId: null,
    worker: {firstName: null, lastName: null},
    locationId: null,
    sku: null,
    uom: null,
    description: null,
    actualQuantity: 2,
    planQuantity: 4
});


const issuesSummaryCursor = state.cursor(["issues", "summary"]);
const emptyResults = fromJS({results: []});

export const dispatchToken = register(({action, data}) => {
  switch (action) {
      case actions.fetchIssuesSummary:
          if (data) {
              issuesSummaryCursor((currentSummary) => {
                  return fromJS(data);
              });
          }
          break;
      case actions.fetchTypeIssues:
          if (data) {
              state.cursor(["issues", data.storageKey])((currentIssues) => {
                  return fromJS(data.data);
              });
          }
          break;
      case actions.issueSelected:
          if (data) {
              selectedIssueCursor((selectedIssue) => toIssue(data));
          }
          break;
  }

});

export function getIssuesSummary() {
    let summary = issuesSummaryCursor();
    if (summary) {
        return summary;
    } else {
        return emptyResults;
    }
};

export function getTypeIssues(key) {

    let issues =  state.cursor(["issues", key])();
    if (issues) {
        return issues;
    } else {
        return emptyResults;
    }
};


export function getSelectedIssue() {
  return selectedIssueCursor();
};

import Chance from 'chance';
const chance = new Chance();
import {Worker} from 'data/workers/store';
export function generateIssue() {
    let planQuantity = chance.integer({min: 3, max: 25});
    return IssueEvent({
        persistentId: chance.guid(),
        orderId: chance.string({length: 12, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'}),
        eventTimestamp: chance.hammertime(),
        resolvedTimestamp: chance.hammertime(),
        resolver: chance.email(),
        resolution: "Acknowledged",
        worker: Worker({firstName: chance.first(), lastName: chance.last()}),
        locationId: _.sample("ABCD") + "-" + chance.integer({min: 100, max: 300}),
        sku: chance.string({length: 12, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'}),
        uom: _.sample(["each"]),
        description: chance.string(),
        planQuantity: planQuantity,
        actualQuantity: planQuantity - chance.integer({min: 1, max: 3})
    });
};
