import {asMutable} from "pages/Mobile/asMutable";

export function getOrderSearch({orderSearch}) {
  return orderSearch;
}

export const getOrderSearchMutable = asMutable(getOrderSearch);