import React from 'react';
import DocumentTitle from 'react-document-title';
import {getAPIContext} from 'data/csapi';
import {SingleCellLayout} from 'components/common/pagelayout';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {acSetFilterAndRefresh} from "../../Mobile/WorkerPickCharts/store";
import WorkerPickCharts from '../../Mobile/WorkerPickCharts/WorkerPickCharts.react';
import PivotTable from '../PivotTable/PivotTable';

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
        return (
          <SingleCellLayout title="Picks By Hour">
            <PivotTable />
            <WorkerPickCharts {...this.props}
                                desktop={true}
                                expand={false} />
          </SingleCellLayout>);

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
