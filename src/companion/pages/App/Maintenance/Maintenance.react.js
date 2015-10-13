import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import {SingleCellLayout, PageGrid, Row, Col} from 'components/common/pagelayout';
import DataObjectPurge from "./DataObjectPurge";
import DataObjectNotificationThreshold from "./DataObjectNotificationThreshold";

export default class Maintenance extends React.Component{

    constructor() {
        super();
    }


    render() {
        return (<DocumentTitle title="Maintenance">
                <SingleCellLayout>
                    <Tabs className="nav-tabs-simple" defaultActiveKey="database">
                        <Tab eventKey="database" title="Database">
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
                        </Tab>
                        <Tab eventKey="edi" title="EDI">
                            <PageGrid>
                                <Row>
                                    <Col sm={12}>
                                        EDI Notification Threshold Configuration Coming Soon
                                        {/** <EdiNotificationThreshold /> */}
                                    </Col>
                                </Row>
                            </PageGrid>
                        </Tab>
                    </Tabs>


                </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
