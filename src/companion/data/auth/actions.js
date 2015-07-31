import Promise from 'bluebird';
import setToString from 'lib/settostring';
import {ValidationError} from 'lib/validation';
import {dispatch} from 'dispatcher';
import {validate} from 'validation';
import {authenticate, getUser, logout, ConnectionError} from 'data/csapi';

export function updateFormField({target: {name, value}}) {
  // Both email and password max length is 100.
  value = value.slice(0, 100);
  dispatch(updateFormField, {name, value});
};



export function login(fields) {
  return dispatch(login, validateForm(fields)
    .then(() => {
      return authenticateCredentials(fields);
    })
    .then((authData) => logged(authData, fields))
    .catch((error) => {
        loginError(error);
        throw error;
    })
  );
};

export function loginCookies() {
    return getUser()
        .then((user) => {
            logged(user, null);
            return user;
        });
};

function validateForm(fields) {
  return validate(fields)
    .prop('email').required().email()
    .prop('password').required()//.simplePassword()
    .promise;
}

function authenticateCredentials(fields) {
    let {email, password} = fields;
    return authenticate(email, password)
        .catch((e) =>{
            if (e instanceof ConnectionError) {
                throw e;
            } else {
                throw new ValidationError ('Wrong username or password', 'password');
            }
        });
}

export function loginError(error) {
  return dispatch(loginError, error);
}

export function logged(authData, fields) {
  let data = {authData: authData,
              fields: fields};
  return dispatch(logged, data);
}

/**
 * optional parameter to flip store field
 */
export function loggedout(toStore) {
    logout().done(() => {
        dispatch(loggedout, {store: toStore});
    });

}

setToString('auth', {
  updateFormField, login, loginError, logged, loggedout
});
