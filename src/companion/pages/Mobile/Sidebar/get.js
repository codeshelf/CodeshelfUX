import {asMutable} from "pages/Mobile/asMutable";

export function getSidebar({sidebar}) {
  return sidebar;
}

export const getSidebarMutable = asMutable(getSidebar);
