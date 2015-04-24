import React from 'react';
export class PageGrid extends React.Component {
    render() {
        return (<div className="container-fluid padding-25 sm-padding-10">{this.props.children}</div>);
    }
};
export const Row = require('react-bootstrap').Row;
export const Col = require('react-bootstrap').Col;
