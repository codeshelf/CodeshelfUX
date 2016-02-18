import {getOrderSearch} from "./get";
import {createStore} from "../storeFactory";


// all avalible properties
const MAX_RESULTS = 5;
const properties = ["persistentId", "orderId", "customerId", "shipperId", "destinationId", "containerId",
    "status", "orderLocationAliasIds", "groupUi", "active", "fullDomainId", "wallUi", "orderType", "dueDate", "orderDate"];
// proprties for search
const simpleProperties = ["orderId", "dueDate", "status"];

function searchApiCall(facilityContext, text) {
  const findOrders = facilityContext.findOrders;
  const filterText = text.includes("*")? text : `*${text}*`;
  const filter = {
        properties: simpleProperties,
        orderId: filterText,
        limit: MAX_RESULTS
  };
  return findOrders(filter);
}

const store = createStore("orderSearch", getOrderSearch, searchApiCall);

export const orderSearchReducer = store.searchReducer;
export const acChangeFilter = store.acChangeFilter;
export const acSearch = store.acSearch;
