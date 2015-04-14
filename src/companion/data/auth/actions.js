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
      return validateCredentials(fields);
    })
    .catch(error => {
      loginError(error);
      throw error;
    })
    .then((authData) => logged(authData))
  );
};

export function loginCookies() {
    return getUser().then((user) => logged(user));
};

function validateForm(fields) {
  return validate(fields)
    .prop('email').required().email()
    .prop('password').required().simplePassword()
    .promise;
}

function validateCredentials(fields) {
    return new Promise((resolve, reject) => {
        var email = fields.email;
        var password = fields.password;
        return authenticate(email, password)
            .done((user) => resolve(user))
        .fail(() => {
            reject(new ValidationError ('Wrong password', 'password'));
        });
    });
}

export function loginError(error) {
  dispatch(loginError, error);
}

export function logged(authData) {
  dispatch(logged, authData);
}

export function loggedout() {
    logout().done(() => {
        dispatch(loggedout);
    });

}

setToString('auth', {
  updateFormField, login, loginError, logged, loggedout
});
