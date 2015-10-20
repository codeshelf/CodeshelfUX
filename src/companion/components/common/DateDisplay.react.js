import React from 'react';
import {formatTimestamp, formatISO} from 'lib/timeformat';


export default class DateDisplay extends React.Component {
    static renderExportValue(value) {
        return formatISO(value);
    }

    render() {
        let {cellData} = this.props;
        let formattedData = (cellData) ? formatTimestamp(cellData) : "";
        return (<span data-value={cellData}>{formattedData}</span>);
    }
}
