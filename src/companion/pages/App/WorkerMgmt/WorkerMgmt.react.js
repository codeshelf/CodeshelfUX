import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody, IBoxTitleBar, IBoxTitleText} from 'components/common/IBox';
import {Table} from 'components/common/Table';
import {Modal} from 'react-bootstrap';
import {ButtonLink} from 'components/common/bootstrap';
import DateDisplay from 'components/common/DateDisplay';
import Icon from 'react-fa';

import Immutable from 'immutable';
import {RouteHandler} from 'react-router';


import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';

import exposeRouter from 'components/common/exposerouter';


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
                columnName: "hrId",
                displayName: "HR ID"
            },
            {
                columnName: "groupName",
                displayName: "Group"
            },
            {
                columnName: "updated",
                displayName: "Updated",
                customComponent: DateDisplay
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Edit
            }
        ];
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }


    componentWillMount() {
        fetchWorkers();
    }

    render() {
        var rows = getWorkers();
        let title = "Manage Workers";
        return (<DocumentTitle title={title}>
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <IBox>
                                <IBoxBody>
                                    <div>
                                        <div className="pull-right">
                                            <ButtonLink bsStyle="primary" to="workerdisplay" params={{workerId: "new"}} >
                                                <Icon name="plus" />
                                            </ButtonLink>
                                        </div>
                                    </div>
                                    <Table results={rows}
                                        columns={this.columns}
                                        columnMetadata={this.columnMetadata}
                                    />
                                </IBoxBody>
                            </IBox>
                            <RouteHandler formMetadata={this.columnMetadata}/>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }


};



class Edit extends React.Component {
    render() {
        var formData = this.props.rowData;
        var persistentId = formData.get("persistentId");
        return (<ButtonLink bsStyle="primary"
                            to="workerdisplay"
                            params={{workerId: persistentId}}>
                    <Icon name="edit" />
                </ButtonLink>);
    }

}
