import {authCursor} from 'data/state';
import {login, loginError, updateFormField, loggedout} from './actions';
import {register} from 'dispatcher';

export function getForm() {
  return authCursor().get('form');
}

export const dispatchToken = register(({action, data}) => {

  switch (action) {
    case login:
      authCursor(auth => {
        return resetForm(auth);
      });
      break;
    case loggedout:
        let {store} = data;
        if (store !== undefined) {
            authCursor(auth => {
                return auth.setIn(['form', 'fields', 'store'], !!store);
            });
        }
      break;
    case loginError:
      authCursor(auth => {
        return auth.setIn(['form', 'error'], data);
      });
      break;

    case updateFormField:
      authCursor(auth => {
        return auth.setIn(['form', 'fields', data.name], data.value);
      });
      break;
  }

});

function resetForm(auth) {
  return auth
    .setIn(['form', 'error'], null)
    .setIn(['form', 'fields', 'email'], '')
    .setIn(['form', 'fields', 'password'], '')
    .setIn(['form', 'fields', 'store, false']);
}
