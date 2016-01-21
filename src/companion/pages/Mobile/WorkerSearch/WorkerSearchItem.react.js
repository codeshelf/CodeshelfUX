import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import {DateDisplay} from "../DateDisplay.react.js";

export class WorkerSearchItem extends Component {
  renderId(id, filterText) {
    if (filterText === "") return id;

    const countOfStars = filterText.split("").filter((ch) => ch === "*").length
    if (countOfStars > 0) {
      //TODO no highlight for now
      return id;
    }
    let [first, ...rest] = id.split(filterText);

    // if text is not in id rest is empty array
    if (rest.length === 0) return id;
    // join rest for multiple occurances
    rest = rest.join(filterText);
    return (
      <span>{first}<b>{filterText}</b>{rest}</span>
    );
  }

  render() {
    const {domainId, updated, firstName, lastName, filterText} = this.props;
    return (
      <Link to="mobile-worker-detail-default" params={{id: encodeURIComponent(domainId)}}>
        <Row>
          <Col xs={9}>
            <Row>
              <Col xs={12}>
                  <h3>{this.renderId(domainId, filterText)}</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {/* TODO format due date with some formater */}
                {firstName} {lastName} - <DateDisplay date={updated} />
              </Col>
            </Row>
          </Col>
          <Col xs={3}>
              <Button bsStyle="link"><Icon name="chevron-right"/></Button>
          </Col>
        </Row>
        <Row><Col xs={12}><hr style={{marginTop: "0.5em", marginBottom: "0.5em"}} /></Col></Row>
      </Link>
    );
  }
}
