import React from 'react';
import {formatTimestamp, toTimeZone, formatISO} from 'lib/timeformat';


export default class DateDisplay extends React.Component {
    static renderExportValue(value) {
        return formatISO(value);
    }

    render() {
        let {cellData, utcOffset /*in minutes */} = this.props;
        let date = cellData;
        if (utcOffset) {
            date = toTimeZone(cellData, utcOffset);
        }

        let formattedData = (cellData) ? formatTimestamp(date) : "";
        return (<span data-value={cellData}>{formattedData}</span>);
    }
}
