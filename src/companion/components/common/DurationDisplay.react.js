import React from 'react';
import {formatDuration} from 'lib/timeformat';

export default class DurationDisplay extends React.Component {
    render() {
        let {cellData} = this.props;
        let formatted = (cellData) ? formatDuration(cellData) : "";
        return (<span data-value={cellData}>{formatted}</span>);
    }
}
