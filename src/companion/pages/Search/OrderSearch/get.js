import {asMutable} from "pages/asMutable";

export function getOrderSearch({orderSearch}) {
  return orderSearch;
}

export const getOrderSearchMutable = asMutable(getOrderSearch);