import React from 'react';
import DocumentTitle from 'react-document-title';
import {getAPIContext} from 'data/csapi';
import {SingleCellLayout} from 'components/common/pagelayout';
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

        const {selected} = this.props;
        var apiContext = getAPIContext(selected);
        return (<DocumentTitle title="Picks By Hour">
                  <SingleCellLayout>
                    <IBox data={filter}
                      <PickerEventsIBox apiContext={apiContext} />
                                        reloadFunction={acSetFilterAndRefresh}
                                        loading={showLoading}>
                    </IBox>
                  </SingleCellLayout>
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
