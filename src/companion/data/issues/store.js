import * as actions from './actions';
import {Range, Record, List, fromJS, Map} from 'immutable';
import {register} from 'dispatcher';
import {selectedIssueCursor, state} from 'data/state';
import _ from 'lodash';


/*
let schema = {
    issues: {
        summaries: {
            issueType: {resolved: boolean, type: IssueType, count: number},
            issueItems: {resolved: boolean, type: IssueType, item: IssueItem, count: number},
            issueWorkers: {resolved: boolean, type: IssueType, worker: IssueWorker, count: number}
        },
        entities: {
            IssueId : Issue
        }
    }
};
*/

const issuesUnresolvedByTypeCursor = state.cursor(["issues", "unresolved"]);
const issuesByIdCursor = state.cursor(["issues", "byId"]);
const emptyResults = fromJS({results: []});

function issuesCursor(keys) {
    var newKeys = List(keys).unshift("issues");
    return state.cursor(newKeys);
}

function getIssuesFromCursor(keys) {
    let issues = issuesCursor(keys)();
    if (issues) {
        return issues;
    } else {
        return emptyResults;
    }
}

export const dispatchToken = register(({action, data}) => {
  switch (action) {
      case actions.fetchUnresolvedIssuesByType:
          if (data) {
              issuesUnresolvedByTypeCursor((currentSummary) => {
                  return fromJS(data);
              });
          }
          break;
      case actions.fetchItemIssues:
          if (data) {
              issuesCursor(data.storageKeys)((currentSummary) => {
                  return fromJS(data.data);
              });
          }
          break;
      case actions.fetchTypeIssues:
          if (data) {
              issuesCursor(data.storageKeys)((currentIssues) => {
                  return fromJS(data.data);
              });
          }
          break;
  }

});

export function getIssuesSummary() {
    let summary = issuesUnresolvedByTypeCursor();
    if (summary) {
        return summary;
    } else {
        return emptyResults;
    }
};

export function getItemIssues(keys) {
    return getIssuesFromCursor(keys);
}

export function getTypeIssues(keys) {
    return getIssuesFromCursor(keys);
};
