import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import {DateDisplay} from "../DateDisplay.react.js";

export class OrderSearchItem extends Component {
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
    const {orderId, dueDate, status, filterText} = this.props;
    return (
      <ListGroupItemLink to="mobile-order-datail" params={{id: orderId}}>
        <Row className="searchResult">
          <Col xs={9} >
            <dl>
              <dt>{this.renderId(orderId, filterText)}</dt>
              <dd>{status} - <DateDisplay date={dueDate} /></dd>
            </dl>
          </Col>
          <Col xs={3} className="verticalCenter">
              <Button bsStyle="link" ><Icon name="chevron-right"/></Button>
          </Col>
        </Row>
      </ListGroupItemLink>
    );
  }
}
