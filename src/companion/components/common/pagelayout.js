import React from 'react';
export class PageGrid extends React.Component {
    render() {
        return (<div className="wrapper wrapper-content">{this.props.children}</div>);
    }
}
export const Row = require('react-bootstrap').Row;
export const Col = require('react-bootstrap').Col;
