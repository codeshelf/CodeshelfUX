import  React from 'react';
import DocumentTitle from 'react-document-title';
import {List, Record} from "immutable";
import Chance from 'chance';
import _ from 'lodash';

import {UnresolvedEvents, ResolvedEvents} from './EventsGrid';
const chance = new Chance();

const UPCSkipIssue = Record({
        eventTimestamp: null,
        resolvedTimestamp: null,
        resolvedBy: null,
        worker: null,
        workDetail: null
    }
);

export default class SkippedVerificationList extends React.Component{

    constructor() {
        this.issues = List(_.range(12).map((i) => {
            return UPCSkipIssue({
                persistentId: chance.guid(),
                eventTimestamp: chance.hammertime(),
                resolvedTimestamp: chance.hammertime(),
                resolvedBy: chance.email(),
                worker: {},
                workDetail: {}
            });
        }));
    }

    render() {

        return (<DocumentTitle title="Skipped UPC Verification">
                <div>
                    <div><a>By Item</a>  | <a>By Worker</a></div>
                    <div><a>Resolved</a> | <a>Unresolved</a></div>
                <UnresolvedEvents events={this.issues}/>
                <ResolvedEvents events={this.issues}/>
                </div>
                </DocumentTitle>
               );
    }
};
