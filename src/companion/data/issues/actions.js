import setToString from 'lib/settostring';
import * as dispatcher from 'dispatcher';
import {getAPIContext} from 'data/csapi';
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

export function replenItem(issue) {
  return dispatch(replenItem, getAPIContext().replenishItem(issue)).then((result) => {
    return result;
});

}

export function resolveIssue(issue) {
    dispatch(resolveIssue, getAPIContext().resolveIssue(issue)).then(() => {
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
    dispatch(fetchItemIssues, getAPIContext().getIssues(criteria).then((data) => {
        return {
            storageKeys: storageKeys,
            data: data
        };
    }));
};

export function fetchUnresolvedIssuesByType(filter) {
    let criteria = {
        filterBy: filter,
        groupBy: "type"
    };
    dispatch(fetchUnresolvedIssuesByType, getAPIContext().getIssues(criteria));
};

export function fetchTypeIssues(storageKeys, criteria) {
    dispatch(fetchTypeIssues, getAPIContext().getIssues(criteria)
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

// Override actions toString for logging.
setToString('issues', {
    resolveIssue, replenItem, fetchTypeIssues, fetchItemIssues, fetchUnresolvedIssuesByType, issueSelected
});
