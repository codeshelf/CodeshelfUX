import {fromJS} from 'immutable';
import {logged, loggedout} from 'data/auth/actions';
import {register} from 'dispatcher';
import {userCursor} from 'data/state';

const getIn = (path) => userCursor().getIn(path);

export const dispatchToken = register(({action, data}) => {

  switch (action) {
    case logged:
      userCursor(user => {
        return user.setIn(['authData'], fromJS(data));
      });
      break;
    case loggedout:
      userCursor(user => {
          return user.setIn(['authData'], null);
      });
      break;
  }

});

export function getSelectedTenant() {
    return getIn(['authData', 'tenant']);
}

export function isLoggedIn() {
  // TODO: Use sessionStorage and real redirect to fix Chrome.
  return !!getIn(['authData']);
}
