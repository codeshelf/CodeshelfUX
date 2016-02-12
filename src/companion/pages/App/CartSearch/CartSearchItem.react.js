import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Mobile/Search/SearchItem.react.js";
import {Link} from '../../Mobile/links';

export class CartSearchItem extends Component {

  render() {
    const {domainId, deviceGuid, filterText} = this.props;
    const subtitle = deviceGuid;
    return (
      <Link to={`carts/${domainId}`}>
        <tr>
            <td>{domainId}</td>
            <td>{deviceGuid}</td>
        </tr>
      </Link>
    );
  }
}
