import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, Grid, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';

export class SearchInput extends Component {
  renderInput(value, onChange) {
    return <Input
        type="text"
        value={value}
        placeholder={this.props.placeholder}
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={onChange} />;
  }

  render() {
    console.log(this.props);
    const {filter, acChangeFilter, acSearch} = this.props;
    const filterText = filter.text;
    return (
      <Row style={{"paddingTop":"10px"}}>
        <Col xs={9}>
         {this.renderInput(filterText, () => acChangeFilter(this.refs.input.getValue()))}
        </Col>
        <Col xs={3}>
          <Button bsStyle="primary" onClick={() => acSearch(filterText) }><Icon name="search"/></Button>
        </Col>
      </Row>
    );
  }
}
