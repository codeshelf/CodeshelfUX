import React, {Component} from 'react';
import { NavItemLink, MenuItemLink, ButtonLink} from '../links';
import Icon from "react-fa";

class HomeSearch extends Component {
  render() {
    return (
      <div>
        <ButtonLink bsStyle="link"
          to="mobile-search-orders"
          id="mobile-search-orders"
          name="mobile-search-orders">
            <Icon name="search" size="lg"/>
            Orders
        </ButtonLink>
        {" "}
        <ButtonLink bsStyle="link"
          to="mobile-search-workers"
          id="mobile-search-workers"
          name="mobile-search-workers">
            <Icon name="search" size="lg"/>
            Workers
        </ButtonLink>
      </div>
    );
  }
}

export default HomeSearch;