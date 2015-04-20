import React from 'react';
import formatTimestamp from 'lib/timeformat';

export default class DateDisplay extends React.Component {
    render() {
        return (<span>{formatTimestamp(this.props.data)}</span>);
    }
}
