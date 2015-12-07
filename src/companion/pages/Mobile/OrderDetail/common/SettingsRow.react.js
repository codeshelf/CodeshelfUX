import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';
import "./SettingsRow.styl";

export class SettingsRow extends Component {

  render() {
    const {onClickReload , onClickSettings} = this.props;
    return (
        <Row className="settings">
          <Col xs={4} xsOffset={8}>
            <Button bsStyle="primary" bsSize="xs" onClick={onClickReload}><Icon name="refresh" /></Button>
            <Button bsStyle="primary" bsSize="xs" onClick={onClickSettings}><Icon name="gears" /></Button>
          </Col>
        </Row>
    );
}
}
