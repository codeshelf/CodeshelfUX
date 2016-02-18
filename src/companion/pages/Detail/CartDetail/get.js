import {asMutable} from "pages/asMutable";

export function getCartDetail(state) {
  const {cartDetail} = state;
  return cartDetail;
}

export const getCartDetailMutable = asMutable(getCartDetail);