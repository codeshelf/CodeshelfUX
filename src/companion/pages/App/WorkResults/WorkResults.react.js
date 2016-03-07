import React from 'react';
import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import PickerEventsIBox from './PickerEventsIBox';
import {IBox} from '../../IBox.react.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {acSetFilterAndRefresh} from "../../Mobile/WorkerPickCharts/store";

class WorkResults extends React.Component{
    render() {
        const {filter, 
               acSetFilterAndRefresh, 
               error, 
               whatIsLoading, 
               whatIsLoaded} = this.props;

        const showLoading = (whatIsLoading !== null || (whatIsLoaded === null && !error));

        var apiContext = getFacilityContext();
        return (<DocumentTitle title="Picks By Hour">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <IBox data={filter} 
                                  reloadFunction={acSetFilterAndRefresh} 
                                  loading={showLoading}>
                                <PickerEventsIBox {...this.props} apiContext={apiContext} />
                            </IBox>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        whatIsLoaded: state.workerPickChart.whatIsLoaded,
        filter: state.workerPickChart.filter,
        whatIsLoading: state.workerPickChart.whatIsLoading,
        error: state.workerPickChart.error
    };
}

const mapDispatch = (dispatch) => {
  return bindActionCreators({acSetFilterAndRefresh}, dispatch);
}

export default connect(mapStateToProps, mapDispatch)(WorkResults);
