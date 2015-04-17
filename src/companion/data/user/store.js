import {fromJS} from 'immutable';
import {logged, loggedout} from 'data/auth/actions';
import {register} from 'dispatcher';
import {userCursor} from 'data/state';

const getIn = (path) => userCursor().getIn(path);

export const dispatchToken = register(({action, data}) => {

  switch (action) {
    case logged:
      userCursor(user => {
          let authResponse = fromJS(data);
          //wrap permissions in wildcardpermission
          return user.setIn(['authData'], authResponse.updateIn(['user', 'permissions'], (permissions) => {
              return permissions.map(p => new WildcardPermission(p));
          }));
      });
      break;
    case loggedout:
      userCursor(user => {
          return user.setIn(['authData'], null);
      });
      break;
  }

});

export function hasPermission(permissionToCheck) : boolean {
    let permissions = getIn(['authData', 'user', 'permissions']);
    let wildcardPermissionToCheck = new WildcardPermission(permissionToCheck);
    let matchingPermission = permissions.find((wildcardPermission) => {
        return wildcardPermission.implies(wildcardPermissionToCheck);
    });
    return (matchingPermission != null);
}

export function getSelectedTenant() {
    return getIn(['authData', 'tenant']);
}

export function isLoggedIn() {
  // TODO: Use sessionStorage and real redirect to fix Chrome.
  return !!getIn(['authData']);
}

class WildcardPermission {
    constructor(permissionString) {
        this.parts = this.toParts(permissionString);
    }

    toParts(permissionString) {
        var parts = [];
        var levels = permissionString.split(':');

        for (var i = 0; i < levels.length; ++i) {
            parts.push(levels[i].split(','));
        }
        return parts;
   }

   asParts() {
       return this.parts;
   }

   implies(other) {
       var i;
       for (i = 0; i < other.asParts().length; ++i) {
           if (this.parts.length - 1 < i) {
               return true;
           } else {

               if (this.parts[i].indexOf('*') === -1 && !this.containsAll(this.parts[i], other.asParts()[i])) {
                   return false;
               }
           }
      }

      for (; i < this.parts.length; ++i) {
          if (this.parts[i].indexOf('*') === -1) {
              return false;
          }
      }
      return true;
  }

  containsAll(source, vals) {
      for (var i = 0; i < vals.length; ++i) {
          if (source.indexOf(vals[i]) === -1) {
              return false;
          }
      }
      return true;
  }
}
