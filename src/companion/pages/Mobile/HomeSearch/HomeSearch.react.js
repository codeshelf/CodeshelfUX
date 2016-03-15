import {Component} from 'react';
import {Row, Col, ListGroup} from 'react-bootstrap';
import {ListGroupItemLink} from '../../links';
import Icon from "react-fa";

class HomeSearch extends Component {

  renderItem(to, iconName, title) {
    return (
        <ListGroupItemLink to={to} id={to} name={to} 
                           shouldHaveFacility={true}>
          <div className="thumbnail-wrapper d48 circular bg-primary \
                          text-white inline">
            <Icon name={iconName} size="lg"/>
          </div>
          <div className="p-l-10 inline">
            <h3>{title}</h3>
          </div>
        </ListGroupItemLink>
    );
  }

  render() {
    return (
        <Row>
          <Col>
            <ListGroup>
              {this.renderItem("mobile-events", "bar-chart", "Productivity")}
              {this.renderItem("mobile-search-orders", "shopping-cart", "Orders")}
              {this.renderItem("mobile-search-workers", "users", "Workers")}
              {this.renderItem("mobile-search-carts", "shopping-cart", "Carts")}
            </ListGroup>
          </Col>
        </Row>
    );
  }
}
export default HomeSearch;
