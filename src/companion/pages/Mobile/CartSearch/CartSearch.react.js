import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {CartSearchItem} from "./CartSearchItem.react.js";
import {createSearchComponent} from "../../Search/SearchFactory.react.js";

import {getCartSearchMutable} from '../../Search/CartSearch/get';
import {acChangeFilter, acSearch} from '../../Search/CartSearch/store';

function getIdForCart(cart) { return  cart.domainId }

const CartSearch = createSearchComponent(CartSearchItem,
                                        "Enter Cart ID", getIdForCart);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getCartSearchMutable, mapDispatch)(CartSearch);
