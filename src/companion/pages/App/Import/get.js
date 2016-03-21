import {asMutable} from "pages/asMutable";

export function getEdiGateway({ediGateway}) {
  return ediGateway;
}

export const getEdiGatewayMutable = asMutable(getEdiGateway);
