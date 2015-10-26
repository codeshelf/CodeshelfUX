import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import  React from 'react';
import {PageGrid, Row, Col} from 'components/common/pagelayout';

var PickerEventsIBox = require('./PickerEventsIBox');

export default class WorkResults extends React.Component{
    render() {
        var apiContext = getFacilityContext();
        return (<DocumentTitle title="Picks By Hour">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <PickerEventsIBox apiContext={apiContext} />
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
        );
    }
};
