import {asMutable} from "pages/Mobile/asMutable";

export function getCartDetail(state) {
  const {cartDetail} = state;
  return cartDetail;
}

export const getCartDetailMutable = asMutable(getCartDetail);