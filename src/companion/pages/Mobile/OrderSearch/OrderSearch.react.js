import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {OrderSearchItem} from "./OrderSearchItem.react.js";
import {createSearchComponent} from "../Search/SearchFactory.react.js";

import {getOrderSearch} from './get';
import {acChangeFilter, acSearch} from './store';
import {DateDisplay} from "../DateDisplay.react.js";

/* NOT USED RIGHT NOW
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
*/


const OrderSearch = createSearchComponent(OrderSearchItem, "Enter Order ID");

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getOrderSearch, mapDispatch)(OrderSearch);
