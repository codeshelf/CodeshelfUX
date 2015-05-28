import React from "react";
import DocumentTitle from "react-document-title";

export class SingleCellLayout extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let {title} = this.props;
        return (<DocumentTitle title={title}>
                    <PageGrid>
                        <Row>
                            <Col sm={12}>
                                {this.props.children}
                            </Col>
                        </Row>
                    </PageGrid>
                </DocumentTitle>);
    }
};

export class PageGrid extends React.Component {
    render() {
        return (<div className="container-fluid padding-25 sm-padding-10">{this.props.children}</div>);
    }
};

export const Row = require('react-bootstrap').Row;
export const Col = require('react-bootstrap').Col;
