import React from 'react';
import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import {SingleCellLayout} from 'components/common/pagelayout';
import PickerEventsIBox from './PickerEventsIBox';

export default class WorkResults extends React.Component{
    render() {
        var apiContext = getFacilityContext();
        return (<DocumentTitle title="Picks By Hour">
                  <SingleCellLayout>
                    <PickerEventsIBox apiContext={apiContext} />
                  </SingleCellLayout>
                </DocumentTitle>
        );
    }
};
