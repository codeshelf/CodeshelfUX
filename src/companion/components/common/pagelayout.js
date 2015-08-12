import React from "react";
import DocumentTitle from "react-document-title";

export class FormPageLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {title} = this.props;
        return (<DocumentTitle title={title}>
                    <FormGrid title={title}>
                        {this.props.children}
                    </FormGrid>
                </DocumentTitle>);
    }
}

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

class FormGrid extends React.Component {
    render() {
        let {title} = this.props;
        return (
            <div className="register-container full-height sm-p-t-30">
                <div className="container-sm-height full-height">
                    <Row className="row-sm-height">
                        <Col sm={12} className="col-sm-height col-middle">
                            <h1>{title}</h1>
                            {this.props.children}
                        </Col>
                    </Row>
                </div>
            </div>
            );
    }
}


export const Row = require('react-bootstrap').Row;
export const Col = require('react-bootstrap').Col;
