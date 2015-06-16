import Promise from 'bluebird';
import setToString from 'lib/settostring';
import {ValidationError} from 'lib/validation';
import {dispatch} from 'dispatcher';
import {validate} from 'validation';
import {authenticate, getUser, logout} from 'data/csapi';

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
    .then((authData) => logged(authData))
    .catch((error) => {
        loginError(error);
        throw error;
    })
  );
};

export function loginCookies() {
    return getUser()
        .then((user) => {
            logged(user);
            return user;
        });
};

function validateForm(fields) {
  return validate(fields)
    .prop('email').required().email()
    .prop('password').required().simplePassword()
    .promise;
}

function authenticateCredentials(fields) {
    let {email, password} = fields;
    return authenticate(email, password)
    .catch(() =>{
        throw new ValidationError ('Wrong password', 'password');
    });
}

export function rememberCredentials(e) {
    e.preventDefault();
}

export function loginError(error) {
  return dispatch(loginError, error);
}

export function logged(authData) {
  return dispatch(logged, authData);
}

export function loggedout() {
    logout().done(() => {
        dispatch(loggedout);
    });

}

setToString('auth', {
  updateFormField, login, loginError, logged, loggedout
});
