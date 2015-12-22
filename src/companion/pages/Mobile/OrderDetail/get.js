import {asMutable} from "pages/Mobile/asMutable";

export function getOrderDetail(state) {
  const {orderDetail} = state;
  return orderDetail;
}

export const getOrderDetailMutable = asMutable(getOrderDetail);