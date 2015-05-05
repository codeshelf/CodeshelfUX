import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getFacilityContext} from 'data/csapi';

import _ from 'lodash';

export function  resolveIssue(issue) {
    dispatch(resolveIssue, getFacilityContext().resolveIssue(issue).then(
        (data) => {

        }
    ));
};

export function fetchItemIssues(item) {
    let itemId = item.get("itemId");
    dispatch(fetchItemIssues, getFacilityContext().getIssues({filterBy: {
        itemId: itemId,
        resolved: false
    }}).then((data) => {
        return {
            storageKey: itemId,
            data: data
        };
    }));
};

export function fetchIssuesSummary(criteria) {
    dispatch(fetchIssuesSummary, getFacilityContext().getIssues(criteria));
};

export function fetchTypeIssues(storageKey, criteria) {
    dispatch(fetchTypeIssues, getFacilityContext().getIssues(criteria)
        .then((data) => {
            return {
                storageKey: storageKey,
                data: data
            };
        }));
};

export function issueSelected(issue) {
    dispatch(issueSelected, issue);
}

export function selectIssueByName(name) {
    getIssues().done((issues) => {
        let issue = _.find(issues, "domainId", name);
        if (issue) {
            dispatch(issueSelected, issue);
        } else {
            throw `no matching issue for ${name}`;
        }
    });
};


export function selectFirstIssue() {
    getIssues().done((issues) => {
        if (issues && issues.length > 0) {
            dispatch(issueSelected, issues[0]);
        }
        else {
            throw "no issues available";
        }
    });
};


// Override actions toString for logging.
setToString('issues', {
  resolveIssue, fetchTypeIssues, fetchItemIssues, fetchIssuesSummary, selectFirstIssue, selectIssueByName, issueSelected
});
