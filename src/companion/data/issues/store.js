import * as actions from './actions';
import {Range, Record, List, fromJS} from 'immutable';
import {register} from 'dispatcher';
import {selectedIssueCursor, state} from 'data/state';
import _ from 'lodash';

const issuesSummaryCursor = state.cursor(["issues", "summary"]);
const emptyResults = fromJS({results: []});
function issuesCursor(key) {
    return state.cursor(["issues", key]);
}

function getIssuesFromCursor(key) {
    let issues =  issuesCursor(key)();
    if (issues) {
        return issues;
    } else {
        return emptyResults;
    }
}
export const dispatchToken = register(({action, data}) => {
  switch (action) {
      case actions.fetchItemIssues:
          if (data) {
              issuesCursor(data.storageKey)((currentSummary) => {
                  return fromJS(data.data);
              });
          }
          break;

      case actions.fetchIssuesSummary:
          if (data) {
              issuesSummaryCursor((currentSummary) => {
                  return fromJS(data);
              });
          }
          break;
      case actions.fetchTypeIssues:
          if (data) {
              issuesCursor(data.storageKey)((currentIssues) => {
                  return fromJS(data.data);
              });
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

export function getItemIssues(itemId) {
    return getIssuesFromCursor(itemId);
}

export function getTypeIssues(type) {
    return getIssuesFromCursor(type);
};
