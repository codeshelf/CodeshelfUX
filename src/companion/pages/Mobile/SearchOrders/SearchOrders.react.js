import React, {Component, PropTypes} from 'react';
import {RouteHandler} from 'react-router';
import {Nav, NavItem, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {Link} from '../links';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getOrderSearch} from './store';
import {acChangeFilter, acSearch} from './store';

export class SearchType extends Component {
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

export class SearchInput extends Component {
  renderInput(value, onChange) {
    return <Input
        type="text"
        value={value}
        placeholder="Enter text"
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
      <Row style={{"padding-top":"10px"}}>
        <Col xs={8}>
         {this.renderInput(filterText, () => acChangeFilter(this.refs.input.getValue()))}
        </Col>
        <Col xs={4}>
          <Button bsStyle="primary" ><Icon name="camera"/></Button>
          <Button bsStyle="primary" onClick={() => acSearch(filterText) }><Icon name="search"/></Button>
        </Col>
      </Row>
    );
  }
}


export class OrderItem extends Component {
  renderId(id, filterText) {
    if (filterText === "") return id;
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
      <Link to="mobile-order-datail" params={{id: orderId}}>
        <Row>
          <Col xs={10}>
            <Row>
              <h2>{this.renderId(orderId, filterText)}</h2>
            </Row>
            <Row>
              {/* TODO format due date with some formater */}
              {status} - {dueDate}
            </Row>
          </Col>
          <Col xs={2}>
            <Button bsStyle="primary" onClick={() => console.log("click") }><Icon name="search"/></Button>
          </Col>
        </Row>
      </Link>
    );
  }
}

const MAX_NUMBER_OF_ORDERS_IN_LIST = 5;

export class OrderList extends Component {
  render() {
    const {isLoading, orders, filter: {text: filterText}} = this.props;
    console.log(`!!!!!!!!! isLoading ${isLoading}, orders ${orders}`);
    if (isLoading || orders === null) {
      return <div> Loading...</div>;
    }
    return (
      <div>
        Number of results: { orders.length }
        {orders.slice(0, MAX_NUMBER_OF_ORDERS_IN_LIST).map((order) => {
          return <OrderItem {...order} filterText={filterText} />
        })}
        {/*Orders: {JSON.stringify(orders)}*/}
      </div>
    );
  }
}


function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}


@connect(getOrderSearch, mapDispatch)
class SearchOrders extends Component {

  componentWillMount() {
    if (this.props.filter.text === null) {
      this.props.acChangeFilter("");
    } else {
      this.props.acChangeFilter(this.props.filter.text);
    }
  }

  render() {
    console.log(`Props for SearchOrders `, this.props);
    const {whatIsLoading, error, orders, filter} = this.props;
    const {acChangeFilter, acSearch} = this.props;

    const isLoading = (whatIsLoading !== null);
    return (
      <div>
        {/*<SearchType />*/}
        <SearchInput  {...{filter, acChangeFilter, acSearch}} />
        <OrderList {...{isLoading, orders, filter}} />
        {/*Dummy results:
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
        </ul>*/}
      </div>
    );
  }
}

SearchOrders.propTypes = {

}

export default SearchOrders;