import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {OrderSearchItem} from "./OrderSearchItem.react.js";
import {createSearchComponent} from "../../Search/SearchFactory.react.js";

import {getOrderSearchMutable} from '../../Search/OrderSearch/get';
import {acChangeFilter, acSearch} from '../../Search/OrderSearch/store';

/* NOT USED RIGHT NOW
export class SearchType extends Component {
  constructor() {
    super();
    //bind this for handle change
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    tab: 1,
  };

  handleChange(selectedKey) {
    this.setState({tab: selectedKey});
  }

  render() {
    console.log("Render state", this.state);
    return (
      <Row>
        <Nav bsStyle="tabs" activeKey={this.state.tab}
             onSelect={this.handleChange}>
          <NavItem eventKey={1}>Order Id</NavItem>
          <NavItem eventKey={2} disabled>Container Id</NavItem>
          <NavItem eventKey={3} disabled>Barcode</NavItem>
        </Nav>
      </Row>
    );
  }
}
*/


function getIdForItem(item) { return  item.orderId }

const OrderSearch = createSearchComponent(OrderSearchItem,
                                          "Enter Order ID", getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getOrderSearchMutable, mapDispatch)(OrderSearch);
