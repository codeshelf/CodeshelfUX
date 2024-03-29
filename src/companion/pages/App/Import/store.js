import {Record, Map} from 'immutable';

import {createStore} from '../ListManagement/storeFactory';

const updateItemCond = (item, action) => {
  if (item.persistentId == action.data.persistentId) {
    return action.data;
  }
  return item;
}

const getUpdateData = (data) => {
    let newData = [];

    newData.push(data.get('id'));
    newData.push({
        username: data.get('username'),
        roles: data.get('roles'),
        active: data.get('active'),
        lastAuthenticated: data.get('lastAuthenticated')
    });
    return newData;
}

const store = createStore({
                          storeName: "ediGateways",
                          getItems: 'getEdiGateways',
                          updateItem: 'updateEdiGateway',
                          useFacility: true,
                          updateItemCond,
                          });

export const acUpdateEdiGatewayForm = store.acUpdateForm;
export const acStoreSelectedEdiGatewayForm = store.acStoreForm;
export const acLoadEdiGateway = store.acLoadItems;
export const acAddEdiGateway = store.acAddItem;
export const acEditEdiGateway = store.acUpdateItem;
export const acUnsetError = store.acUnsetError;
export const ediGatewayReducer = store.listReducer;
