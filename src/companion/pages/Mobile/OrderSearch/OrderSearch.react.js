import React, {Component, PropTypes} from 'react';
import {RouteHandler} from 'react-router';
import {Nav, NavItem, Grid, Row, Col, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {Link} from '../links';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as csapi from 'data/csapi';
import {getOrderSearch} from './get';
import {acChangeFilter, acSearch} from './store';
import {DateDisplay} from "../DateDisplay.react.js";


export class SearchType extends Component {
  constructor() {
    super();
    //bind this for handle change
    this.handleChange = this.handleChange.bind(this);
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
          <NavItem eventKey={2} disabled>Container Id</NavItem>
          <NavItem eventKey={3} disabled>Barcode</NavItem>
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
        placeholder="Enter Order ID"
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
          {/*TODO Camera button is not used in this iteration */}
          {/*<Button bsStyle="primary" disabled><Icon name="camera"/></Button>*/}
          <Button bsStyle="primary" onClick={() => acSearch(filterText) }><Icon name="search"/></Button>
        </Col>
      </Row>
    );
  }
}


export class OrderItem extends Component {
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
      <Link to="mobile-order-datail" params={{id: orderId}}>
        <Row>
          <Col xs={9}>
            <Row>
              <Col xs={12}>
                  <h3>{this.renderId(orderId, filterText)}</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {/* TODO format due date with some formater */}
                {status} - <DateDisplay date={dueDate} />
              </Col>
            </Row>
          </Col>
        <Col xs={3} >
            <Button bsStyle="link" onClick={() => console.log("click") }><Icon name="chevron-right"/></Button>
          </Col>
        </Row>
        <Row><Col xs={12}><hr style={{marginTop: "0.5em", marginBottom: "0.5em"}} /></Col></Row>
      </Link>
    );
  }
}

export class OrderList extends Component {
  render() {
    const {isLoading, error, resultOrders, filter: {text: filterText}} = this.props;
    console.log(`!!!!!!!!! isLoading ${isLoading}, orders ${resultOrders}`);
    if (error) {
      let text = "Can't load request";
      if (error instanceof csapi.ConnectionError || error.message) {
        text = error.message;
      }
      return (
        <Row>
          <Col xs={8}>
            Error: {text}
          </Col>
          <Col xs={4}>
            <Button bsStyle="primary" bsSize="xs" onClick={() => this.props.acChangeFilter(this.props.filter.text)}><Icon name="refresh" /></Button>
          </Col>
        </Row>
      );
    } else if (isLoading && resultOrders === null) {
      return <div> Loading...</div>;
    } else if (resultOrders && resultOrders.total >= 0) {
      return (
        <Row>
          <Col sm={12}>
            Number of results: { resultOrders.total }
            {resultOrders.results.map((order) => {
              return <OrderItem key={order.orderId} {...order} filterText={filterText} />
            })}
            {/*Orders: {JSON.stringify(orders)}*/}
          </Col>
        </Row>
      );
    } else if (resultOrders){ //This might be able to be removed
      return (
        <Row>
          <Col sm={12}>
            Number of results: { resultOrders.length }
            {resultOrders.slice(0,5).map((order) => {
            return <OrderItem key={order.orderId} {...order} filterText={filterText} />
            })}
            {/*Orders: {JSON.stringify(orders)}*/}
          </Col>
        </Row>
      );
    } else {
      return <div></div>;
    }
  }
}

class OrderSearch extends Component {

  componentWillMount() {
    if (this.props.filter.text != null) {
      this.props.acChangeFilter(this.props.filter.text);
    }
  }

  render() {
    console.log(`Props for OrderSearch `, this.props);
    const {whatIsLoading, error, resultOrders, filter} = this.props;
    const {acChangeFilter, acSearch} = this.props;

    const isLoading = (whatIsLoading !== null);
    return (
      <div>
        {/*<SearchType />*/}
        <SearchInput  {...{filter, acChangeFilter, acSearch}} />
        <OrderList {...{isLoading, resultOrders, filter, error, acChangeFilter}} />
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getOrderSearch, mapDispatch)(OrderSearch);
