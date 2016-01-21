import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';
import "./SettingsRow.styl";

export class SettingsRow extends Component {

  render() {
    const {onClickReload , onClickSettings} = this.props;
    let numberOfButtons = 2;
    if (Array.isArray(this.props.children)) {
      numberOfButtons += this.props.children.length;
    }
    return (
        <Row className="settings">
          {/*TODO probably styling should look different*/}
          <Col xs={numberOfButtons === 2? 4: 7} xsOffset={numberOfButtons === 2? 8: 5}>
            {this.props.children}
            <Button bsStyle="primary" bsSize="xs" onClick={onClickSettings}><Icon name="gears" /></Button>
            <Button bsStyle="primary" bsSize="xs" onClick={onClickReload}><Icon name="refresh" /></Button>

          </Col>
        </Row>
    );
}
}
