import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {Link, NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';

export function renderMatch(match, filterText) {
  if (filterText === "") return match;

  const countOfStars = filterText.split("").filter((ch) => ch === "*").length;
  if (countOfStars > 0) {
      //TODO no highlight for now
      return match;
  }
  let [first, ...rest] = match.split(filterText);

  // if text is not in id rest is empty array
  if (rest.length === 0) return match;
  // join rest for multiple occurances
  rest = rest.join(filterText);
  return (
    <span>{first}<b>{filterText}</b>{rest}</span>
  );

}

export class SearchItem extends Component {

  render() {
    const {title, subtitle, ...rest} = this.props;
    return (
      <ListGroupItemLink {...rest} shouldHaveFacility={true}>
        <Row className="searchResult">
          <Col xs={9}>
            <dl>
              <dt>{title}</dt>
              <dd>{subtitle}</dd>
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
