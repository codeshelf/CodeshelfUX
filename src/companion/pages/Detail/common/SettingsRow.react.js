import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';
import "./SettingsRow.styl";

export class SettingsRow extends Component {

  render() {
    const {onClickReload , onClickSettings} = this.props;
    let numberOfButtons = 1;
    if (onClickReload) numberOfButtons++;
    if (Array.isArray(this.props.children)) {
      numberOfButtons += this.props.children.length;
    }
    return (
        <Row className="settings">
          {/*TODO probably styling should look different*/}
          <Col xs={12}>
            <span className="pull-right">
            {this.props.children}
            <Button bsStyle="primary" bsSize="xs" onClick={onClickSettings}><Icon name="gears" /></Button>
            {onClickReload &&
               <Button bsStyle="primary" bsSize="xs" onClick={onClickReload}><Icon name="refresh" /></Button>}
            </span>
          </Col>
        </Row>
    );
}
}
