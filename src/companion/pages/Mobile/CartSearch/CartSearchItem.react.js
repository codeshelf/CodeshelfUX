import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../DateDisplay.react.js";
import {SearchItem, renderMatch} from "../Search/SearchItem.react.js";

export class CartSearchItem extends Component {

  render() {
    const {domainId, deviceGuid, filterText} = this.props;
    const subtitle = deviceGuid;
    return (
        <SearchItem to="mobile-cart-detail-default" params={{id: domainId}}
         title={renderMatch(domainId, filterText)}
         subtitle={subtitle} />
    );
  }
}
