import {asMutable} from "pages/asMutable";

export function getCartSearch({cartSearch}) {
  return cartSearch;
}

export const getCartSearchMutable = asMutable(getCartSearch);