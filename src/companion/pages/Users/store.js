import {getUsers} from 'data/csapi';
import {Record, Map, List} from 'immutable';

const initState = new (Record({
  actions: new (Record({acLoadUsers: {}})),
  users: List()
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

const STARTED = "Loading";
const COMPLETED = "Success";
const ERRORED = "Error";

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
