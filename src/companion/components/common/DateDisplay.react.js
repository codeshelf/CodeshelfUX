import React from 'react';
import {formatTimestamp} from 'lib/timeformat';

export default class DateDisplay extends React.Component {
    render() {
        let {cellData} = this.props;
        let formattedData = (cellData) ? formatTimestamp(cellData) : "";
        return (<span data-value={cellData}>{formattedData}</span>);
    }
}
