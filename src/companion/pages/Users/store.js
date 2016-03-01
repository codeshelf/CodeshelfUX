import {getUsers} from 'data/csapi';
import {Record, Map, List} from 'immutable';
import {createUser, updateUser} from "data/csapi";

const ADD_USER = 'ADD_USER';
const EDIT_USER = 'EDIT_USER';
const LOADING_STARTED = 'LOADING_STARTED';
const LOADING_OK = 'LOADING_OK';
const LOADING_ERROR = 'LOADING_ERROR';
const UPDATE_USER_FORM = 'UPDATE_USER_FORM';

const STARTED = "Loading";
const COMPLETED = "Success";
const ERRORED = "Error";

const initState = new (Record({
  actions: new (Record({acLoadUsers: {}})),
  users: List(),
  addUser: new Map({
    loading: null,
    error: null
  }),
  editUser: new Map({
    loading: null,
    error: null
  }),
  userForm: new Map({
    username: null,
    roles: List(),
    active: null
  })
}));

const Stage = new Record({
  stage: "never run",
  running: null,
  error: null,
  result: null
});

export function usersReducer(state = initState, action) {
  var newState = actionReducer(state, action);
  if (!newState) {
    return state;
  } else {
    return newState;
  }
}

function apiActionType(stage) {
  return "users " + stage;
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

function toState(stage, value) {
  var state = {};
  if (stage === STARTED) {
    state = new Stage({
      stage,
      running: value,
      error: null,
      result: null
    });
  } else if (stage === ERRORED) {
    state = new Stage({
      stage,
      running: null,
      error: value,
      result: null
    });
  } else {
    state = new Stage({
      stage,
      running: null,
      error: null,
      result: value
    });
  }

  return state;
}

function actionReducer(state, action) {
  switch(action.type) {
    case ADD_USER:
      switch (action.status) {
        case LOADING_STARTED: {
           return state.mergeIn(['addUser'], new Map({
             loading: true,
             error: null,
           }));
         }
         case LOADING_OK: {
           const data = state.users;
           data.push(action.data);
           return state.merge({ 
              addUser: {
                loading: null,
                error: null
              },
              users: {...state.users}
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
         // need to be reworked
         case LOADING_OK: {
           const data = state.users;
           let i = 0;
            data.forEach(d => {
              if (d.id == action.userId) {
                data.updateIn([i, 'id'], new Map({
                  ...action.data
                }))
              }
            i++;
            });
           return state.merge({ 
              editUser: {
                loading: null,
                error: null
              },
              users: {...state.users}
           });
         }
         case LOADING_ERROR: {
           return state.mergeIn(['editUser'], new Map({
             loading: null,
             error: `${action.data} : ${action.id}`,
           }));
         }
      }
    case UPDATE_USER_FORM:
      return state.setIn(['userForm', action.fieldName], action.value);
    case apiActionType(STARTED):
    case apiActionType(ERRORED):
      return state.mergeIn(["actions", "acLoadUsers"], action.data);
    case apiActionType(COMPLETED):
      return state.set("users", action.data.result);
  }
  return null;
}

export function acLoadUsers() {
  return (dispatch, getState) => {
    const state = getState();
    const {running} = state.users.actions.acLoadUsers;
    if(!running) {
      recordAsync(getUsers, (stage, value) => {
        dispatch({
          type: apiActionType(stage),
          data: toState(stage, value)
        });
      });
    }
  };
};

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

export function acEditUser(userForm, userId) {
  return (dispatch, getState) => {
    dispatch({
      type: EDIT_USER, 
      status: LOADING_STARTED,
      data: userForm.toJS(),
      userId: userId
    });
  return updateUser(userId, userForm.toJS()).then((data) => {
      console.log(`data from updateUser`, data);
      dispatch({
        type: EDIT_USER, 
        status: LOADING_OK,
        data: userForm.toJS(),
        userId: userId
      });
    }).catch((e) => {
       console.log(`error from updating user`, e);
       dispatch({
        type: EDIT_USER, 
        status: LOADING_ERROR,
        data: userForm.toJS(),
        userId: userId
        });
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
