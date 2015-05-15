import {Set} from 'immutable';

export function keyIn(/*...keys*/) {
    var keySet = Set(arguments);
    return function (v, k) {
        return keySet.has(k);
    };
};
