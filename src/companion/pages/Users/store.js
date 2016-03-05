import {getUsers} from 'data/csapi';
import {Record, Map, List} from 'immutable';
import {createUser, updateUser} from "data/csapi";

const ADD_USER = 'ADD_USER';
const EDIT_USER = 'EDIT_USER';
const GET_USERS = 'GET_USERS';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_OK = 'LOADING_OK';
const LOADING_ERROR = 'LOADING_ERROR';
const UPDATE_USER_FORM = 'UPDATE_USER_FORM';
const STORE_USER_FORM = 'STORE_USER_FORM';

const STARTED = "Loading";
const COMPLETED = "Success";
const ERRORED = "Error";

const initState = new (Record({
  users: new Map({
    data: [],
    error: null,
    loading: null
  }),
  addUser: new Map({
    loading: null,
    error: null
  }),
  editUser: new Map({
    loading: null,
    error: null,
    data: null
  }),
  userForm: null
}));

export function usersReducer(state = initState, action) {
  var newState = actionReducer(state, action);
  if (!newState) {
    return state;
  } else {
    return newState;
  }
}


function recordAsync(fn, callback) {
  //setup chain
  var promise =
        fn()
        .then((result) => {
          callback(COMPLETED, result);
          return result;
        })
        .catch((err) => {
          callback(ERRORED, err);
          throw err;
        });
  callback(STARTED, promise);
  return promise;
}

function actionReducer(state, action) {
  switch(action.type) {
    case GET_USERS: {
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['users'], new Map({
            data: [],
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          return state.mergeIn(['users'], new Map({
            data: action.data,
            loading: null,
            error: null,
          }));
        }
        case LOADING_ERROR: {
          return state.mergeIn(['users'], new Map({
            data: [],
            loading: null,
            error: action.data,
          }));
        }
      }
    }
    case ADD_USER:
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['addUser'], new Map({
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.users.get('data');
          data.push(action.data);
          return state.merge({ 
            addUser: {
              loading: null,
              error: null
            },
            users: {...state.users, data}
          });
        }
        case LOADING_ERROR: {
          return state.mergeIn(['addUser'], new Map({
            loading: null,
            error: action.data,
          }));
        }
      }
    case EDIT_USER:
      switch (action.status) {
        case LOADING_STARTED: {
          return state.mergeIn(['editUser'], new Map({
            loading: true,
            error: null,
          }));
        }
        case LOADING_OK: {
          const data = state.users.get('data');
          const newData = data.map((user) => {
            if (user.id == action.data.id) {
              return action.data;
            }
            return user;
          })
          return state.merge({ 
            editUser: {
              data: action.data,
              loading: null,
              error: null
            },
            users: {...state.users, data: newData}
          });
        }
        case LOADING_ERROR: {
          return state.mergeIn(['editUser'], new Map({
            data: null,
            loading: null,
            error: action.data
          }));
        }
      }
    case UPDATE_USER_FORM:
      return state.setIn(['userForm', action.fieldName], action.value);
    case STORE_USER_FORM:
      return state.set('userForm', action.data);
  }
  return null;
}

function setStatus(type, status, data) {
  return {
    type,
    status,
    data
  };
}

export function acAddUser(userForm) {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_USER,
      data: userForm.toJS(),
      status: LOADING_STARTED
    });
    return createUser(userForm.toJS()).then((data) => {
       console.log(`data from createUser`, data);
       dispatch(setStatus(ADD_USER, LOADING_OK, data));
    }).catch((e) => {
       console.log(`error from creating users`, e);
       dispatch(setStatus(ADD_USER, LOADING_ERROR, e));
    });
   }
}

export function acEditUser(userForm) {
  return (dispatch, getState) => {
    dispatch({
      type: EDIT_USER, 
      status: LOADING_STARTED,
      data: userForm.toJS()
    });
    const unpackedData = {
      username: userForm.get('username'),
      roles: userForm.get('roles'),
      active: userForm.get('active'),
      lastAuthenticated: userForm.get('lastAuthenticated')
    }
    const id = userForm.get('id');
    return updateUser(id, unpackedData).then((data) => {
      console.log(`data from updateUser`, data);
      dispatch({
        type: EDIT_USER, 
        status: LOADING_OK,
        data: userForm.toJS()
      });
    }).catch((e) => {
       console.log(`error from updating user`, e);
       dispatch({
        type: EDIT_USER, 
        status: LOADING_ERROR,
        data: userForm.toJS()
        });
    }); 
  }
}

export function acLoadUsers() {
  return (dispatch, getState) => {
    dispatch(setStatus(GET_USERS, LOADING_STARTED));

    return getUsers().then((data) => {
      console.log(`data from getUsers ${JSON.stringify(data)}`);
      dispatch(setStatus(GET_USERS, LOADING_OK, data));
    }).catch((e) => {
      console.log(`error from getting users`, e);
      dispatch(setStatus(GET_USERS, LOADING_ERROR, e));
    });
  }
}


export function acUpdateUserForm(fieldName, value) {
  return {
    type: UPDATE_USER_FORM,
    fieldName,
    value
  }
}

export function acStoreSelectedUserForm(userForm) {
  return {
    type: "STORE_USER_FORM",
    data: userForm
  }
}
