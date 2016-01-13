import React from 'react';

import {formatTimestamp, formatToSeconds, formatToDate, toTimeZone, formatISO} from 'lib/timeformat';



export default class DateDisplay extends React.Component {
    static renderExportValue(value) {
        return formatISO(value);
    }

    render() {
        let {cellData, utcOffset /*in minutes */, granularity, style} = this.props;
        let formattedDate = "";
        if (cellData) {
          let date = cellData;
          if (utcOffset) {
            date = toTimeZone(cellData, utcOffset);
          }

          if (granularity == 'second') {
            formattedDate = formatToSeconds(date);
          } else if (granularity == 'date') {
            formattedDate = formatToDate(date);
          } else {
            formattedDate = (cellData) ? formatTimestamp(date) : "";
          }
        }
        return (<span style={style} data-value={cellData}>{formattedDate}</span>);
    }
}
