import {asMutable} from "pages/asMutable";

export function getList({list}) {
  return list;
}

export const getListMutable = asMutable(getList);
