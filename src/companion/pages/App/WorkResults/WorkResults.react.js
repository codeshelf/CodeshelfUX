import DocumentTitle from 'react-document-title';
import {getAPIContext} from 'data/csapi';
import  React from 'react';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import PickerEventsIBox from './PickerEventsIBox';

export default class WorkResults extends React.Component{
    render() {
        var apiContext = getAPIContext();
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
