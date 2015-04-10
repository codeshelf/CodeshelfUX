import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {PageGrid, Row, Col} from 'components/common/pagelayout';

import Griddle from 'griddle-react';
import {Modal} from 'react-bootstrap';
import {ButtonLink} from 'react-router-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import {RouteHandler} from 'react-router';

import {selectedWorkerCursor, workersCursor} from 'data/state';

export default class WorkerMgmt extends React.Component{

    constructor() {

        this.columnMetadata = [
            {
                columnName: "lastName",
                displayName: "Last"
            },
            {
                columnName: "firstName",
                displayName: "First"
            },
            {
                columnName: "middleInitial",
                displayName: "M"
            },
            {
                columnName: "badgeId",
                displayName: "Badge"
            },
            {
                columnName: "workerId",
                displayName: "HR ID"
            },
            {
                columnName: "groupId",
                displayName: "Group"
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Edit
            }


        ];
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }



    getWorkers() {
        return workersCursor().toJS();
    }


    render() {
        var rows = this.getWorkers();
        return (<DocumentTitle title="Worker Management">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <Griddle results={rows}
                                     showFilter={true}
                                     columns={this.columns}
                                     columnMetadata={this.columnMetadata}
                                     showSettings={true}>
                            </Griddle>
                            <RouteHandler formMetadata={this.columnMetadata}/>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }


};

class Edit extends React.Component {
    handleClick(rowData, e) {
        selectedWorkerCursor((oldWorker) => {
            var o = {};
            _.forIn(rowData, (value, key) => o[key] = value);
            return new Immutable.Map(o);
        });
    }

    render() {

        var formData = this.props.rowData;
        return (<ButtonLink bsStyle="primary" to="workerdisplay" params={{workerId: formData._id}} ><Icon name="edit" /></ButtonLink>);
    }

}
