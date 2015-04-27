import  React from 'react';
import {List, Record, fromJS} from "immutable";
import {generateIssue} from 'data/issues/store';
import _ from 'lodash';
import IssuesIBox from './IssuesIBox';
export default class SkippedVerificationList extends React.Component{
    constructor() {
        this.issues = List(_.range(12).map((i) => {
            return generateIssue();
        })).sortBy(issue => issue.get("orderId"));
    }

    render() {

        return (<IssuesIBox title="Skipped UPC Verification By Item" workDetails={this.issues.toJS()} />);
    }
};
