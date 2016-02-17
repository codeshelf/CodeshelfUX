import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Mobile/Search/SearchItem.react.js";
import {Link} from '../../Mobile/links';
import Icon from 'react-fa';

export class CartSearchItem extends Component {

  render() {
    const {domainId, deviceGuid, filterText} = this.props;
    const subtitle = deviceGuid;
    return (
      <Link to={`carts/${domainId}`}>
        <tr>
            <td>{renderMatch(domainId, filterText)}</td>
            <td>{deviceGuid}</td>
            <td><Icon name="chevron-right"/></td>
        </tr>
      </Link>
    );
  }
}
