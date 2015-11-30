import React, {Component, PropTypes} from 'react';
import {RouteHandler} from 'react-router';
import {Nav, NavItem, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {Link} from '../links';


class SearchType extends Component {
  constructor() {
    super();
    //bind this for handle change
    this.handleChange = ::this.handleChange;
  }

  state = {
    tab: 1,
  }

  handleChange(selectedKey) {
    this.setState({tab: selectedKey});
  }

  render() {
    console.log("Render state", this.state);
    return (
      <Row>
        <Nav bsStyle="tabs" activeKey={this.state.tab} onSelect={this.handleChange}>
          <NavItem eventKey={1}>Order Id</NavItem>
          <NavItem eventKey={2}>Container Id</NavItem>
          <NavItem eventKey={3}>Barcode</NavItem>
        </Nav>
      </Row>
    );
  }
}

class SearchInput extends Component {
  constructor() {
    super();
    this.handleChange = ::this.handleChange;
  }
  state = {
    val: "",
  }
  handleChange() {
    console.log("handle change", this.refs.input.getValue());
    this.setState({
      val: this.refs.input.getValue()
    });
  }

  renderInput() {
    return <Input
        type="text"
        value={this.state.val}
        placeholder="Enter text"
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange} />;
  }

  render() {
    return (
      <Row style={{"padding-top":"10px"}}>
        <Col xs={8}>
         {this.renderInput()}
        </Col>
        <Col xs={4}>
          <Button bsStyle="primary" ><Icon name="camera"/></Button>
          <Button bsStyle="primary" ><Icon name="search"/></Button>
        </Col>
      </Row>
    );
  }
}

class SearchOrders extends Component {
  render() {
    return (
      <div>
        <SearchType />
        <SearchInput />
        Search orders

        Dummy results:
        <ul>
          <li>
            <Link to="mobile-order-datail" params={{id: 15}}>Link to order 15</Link>
          </li>
          <li>
            <Link to="mobile-order-datail" params={{id: 14}}>Link to order 14</Link>
          </li>
          <li>
            <Link to="mobile-order-datail" params={{id: 13}}>Link to order 13</Link>
          </li>
        </ul>
      </div>
    );
  }
}

SearchOrders.propTypes = {

}

export default SearchOrders;