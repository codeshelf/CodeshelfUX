import {Component} from 'react';
import {SearchItem, renderMatch} from "../../Search/SearchItem.react.js";

export class CartSearchItem extends Component {

  render() {
    const {domainId, deviceGuid, filterText} = this.props;
    const subtitle = deviceGuid;
    return (
        <SearchItem to={`carts/${domainId}`}
         title={renderMatch(domainId, filterText)}
         subtitle={subtitle} />
    );
  }
}
