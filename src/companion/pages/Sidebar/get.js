import {asMutable} from "pages/asMutable";

export function getSidebar({sidebar}) {
  return sidebar;
}

export const getSidebarMutable = asMutable(getSidebar);
