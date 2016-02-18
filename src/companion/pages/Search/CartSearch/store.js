import Promise from "bluebird";
import {getCartSearch} from "./get";
import {createStore} from "../storeFactory";

// all avalible properties
const MAX_RESULTS = 5;
// proprties for search
const simpleProperties = ["domainId", "deviceGuid"];

function searchApiCall(facilityContext, text) {
  const findCarts = facilityContext.findChes;
  const filterText = text.includes("*")? text : `*${text}*`;
  const filter = {
        properties: simpleProperties,
        cheId: filterText,
        limit: MAX_RESULTS
  };
  return findCarts(filter);
}

const store = createStore("cartSearch", getCartSearch, searchApiCall);

export const cartSearchReducer = store.searchReducer;
export const acChangeFilter = store.acChangeFilter;
export const acSearch = store.acSearch;
