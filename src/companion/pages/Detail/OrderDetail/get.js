import {asMutable} from "pages/asMutable";

export function getOrderDetail(state) {
  const {orderDetail} = state;
  return orderDetail;
}

export const getOrderDetailMutable = asMutable(getOrderDetail);