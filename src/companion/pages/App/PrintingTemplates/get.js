import {asMutable} from "pages/asMutable";

export function getPrintingTemplates({printingTemplates}) {
  return printingTemplates;
}

export const getPrintingTemplatesMutable = asMutable(getPrintingTemplates);
