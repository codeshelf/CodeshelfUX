import {asMutable} from "pages/Mobile/asMutable";

export function getCartSearch({cartSearch}) {
  return cartSearch;
}

export const getCartSearchMutable = asMutable(getCartSearch);