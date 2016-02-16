import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {OrderSearchItem} from "./OrderSearchItem.react.js";
import {createSearchComponent} from "../CartSearch/Search.react.js";

import {getOrderSearchMutable} from '../../Mobile/OrderSearch/get';
import {acChangeFilter, acSearch} from '../../Mobile/OrderSearch/store';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";


function getIdForItem(item) { return  item.orderId }

const OrderSearch = createSearchComponent(OrderSearchItem, "Enter Order ID", getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getOrderSearchMutable, mapDispatch)(OrderSearch);
