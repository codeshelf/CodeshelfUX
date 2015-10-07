import React from 'react';
import DocumentTitle from 'react-document-title';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import DataObjectPurge from "./DataObjectPurge";
import DataObjectNotificationThreshold from "./DataObjectNotificationThreshold";

export default class Maintenance extends React.Component{

    constructor() {
        super();
    }


    render() {
                return (<DocumentTitle title="Maintenance">
                        <PageGrid>
                        <Row>
                        <Col sm={12}>
                        {/** <DataObjectNotificationThreshold /> */}
                        </Col>
                        </Row>
                        <Row>
                        <Col sm={12}>
                            <DataObjectPurge />
                        </Col>
                        </Row>
                        </PageGrid>
                </DocumentTitle>
               );
    }
};
