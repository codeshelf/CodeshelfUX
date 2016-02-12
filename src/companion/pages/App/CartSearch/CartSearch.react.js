import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {CartSearchItem} from "./CartSearchItem.react.js";
import {createSearchComponent} from "./Search.react.js";

import {getCartSearchMutable} from '../../Mobile/CartSearch/get';
import {acChangeFilter, acSearch} from '../../Mobile/CartSearch/store';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";

function getIdForCart(cart) { return  cart.domainId }

const CartSearch = createSearchComponent(CartSearchItem, "Enter Cart ID", getIdForCart);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getCartSearchMutable, mapDispatch)(CartSearch);
