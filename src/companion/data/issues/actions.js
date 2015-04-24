import setToString from 'lib/settostring';
import {dispatch} from 'dispatcher';
import {getIssues} from 'data/csapi';
import _ from 'lodash';

export function fetchIssues() {
    dispatch(fetchIssues, getIssues());
}


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
  fetchIssues, selectFirstIssue, selectIssueByName, issueSelected
});
