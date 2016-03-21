import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {OrderSearchItem} from "./OrderSearchItem.react.js";
import {createSearchComponent} from "../Search/Search.react.js";

import {getOrderSearchMutable} from '../../Search/OrderSearch/get';
import {acChangeFilter, acSearch} from '../../Search/OrderSearch/store';
import {DateDisplay} from "../../DateDisplay.react.js";


function getIdForItem(item) { return  item.orderId }

const OrderSearch = createSearchComponent(OrderSearchItem, "Enter Order ID", getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getOrderSearchMutable, mapDispatch)(OrderSearch);
