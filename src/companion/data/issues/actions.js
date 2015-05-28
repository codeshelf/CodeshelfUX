import setToString from 'lib/settostring';
import * as dispatcher from 'dispatcher';
import {getFacilityContext} from 'data/csapi';
import {KeyedIterable} from 'immutable';

import _ from 'lodash';

function dispatch(action, data) {
    return dispatcher.dispatch(action, data);
}

export function subscribe(key, func) {
    return dispatcher.subscribe(["issues", key], func);
};

export function unsubscribe(key) {
    return dispatcher.unsubscribe(["issues", key]);
};

export function getSubscriptions(key) : KeyedIterable {
    return dispatcher.getSubscriptions(key);
};

export function resolveIssue(issue) {
    dispatch(resolveIssue, getFacilityContext().resolveIssue(issue)).then(() => {
        //onsuccess
        let subscriptions = getSubscriptions("issues");
        subscriptions.map((v, k) => {
            if (typeof(v) === "function") {
                v.call();
            } else {
                console.warn("found subscription at ", k , "that was not a function was ", v);
            }
        });

    });
};

export function fetchItemIssues(storageKeys, criteria) {
    dispatch(fetchItemIssues, getFacilityContext().getIssues(criteria).then((data) => {
        return {
            storageKeys: storageKeys,
            data: data
        };
    }));
};

export function fetchUnresolvedIssuesByType() {
    let criteria = {
        filterBy: {
            "resolved" : false
        },
        groupBy: "type"
    };
    dispatch(fetchUnresolvedIssuesByType, getFacilityContext().getIssues(criteria));
};

export function fetchTypeIssues(storageKeys, criteria) {
    dispatch(fetchTypeIssues, getFacilityContext().getIssues(criteria)
        .then((data) => {
            return {
                storageKeys: storageKeys,
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
  resolveIssue, fetchTypeIssues, fetchItemIssues, fetchUnresolvedIssuesByType, selectFirstIssue, selectIssueByName, issueSelected
});
