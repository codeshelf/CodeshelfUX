import {Record, Map} from 'immutable';
import {getUsers, createUser, updateUser} from "data/csapi";

import {createStore} from '../App/ListManagement/storeFactory';


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
                          storeName: "users",
                          getItems: getUsers,
                          addItem: createUser,
                          updateItem: updateUser,
                          mutateUpdateData: getUpdateData
                          });

export const acUpdateUserForm = store.acUpdateForm;
export const acStoreSelectedUserForm = store.acStoreForm;
export const acLoadUsers = store.acLoadItems;
export const acAddUser = store.acAddItem;
export const acEditUser = store.acUpdateItem;
export const acUnsetError = store.acUnsetError;
export const usersReducer = store.listReducer;
