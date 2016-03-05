import React from "react";
import DocumentTitle from "react-document-title";
import {Grid, Row, Col, DropdownButton, MenuItem, Button} from 'react-bootstrap';

export {
  Grid,
  Row,
  Col
}

export function Row1(props) {
  const {children, ...rest} = props
  return (
      <Row>
        <Col {...rest}>
          {children}
        </Col>
      </Row>
  );
}

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
                <Row1>
                  {this.props.children}
                </Row1>
              </DocumentTitle>);
    }
};

export class PageGrid extends React.Component {
    render() {
        return (<Grid fluid className="padding-25 sm-padding-0">{this.props.children}</Grid>);
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
                    <div className="text-center">
                     <h1>{title}</h1>
                    </div>
                    {this.props.children}
                  </Col>
                </Row>
              </div>
            </div>
            );
    }
}
