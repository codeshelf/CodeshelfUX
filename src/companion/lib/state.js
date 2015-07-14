import EventEmitter from 'eventemitter3';
import Immutable from 'immutable';

export default class State extends EventEmitter {

  constructor(state, reviver: ?Function) {
    super();
    this._state = null;
    this._reviver = reviver;
    this.load(state || {});
  }

  load(state: Object) {
    this.set(Immutable.Map.isMap(state)
      ? state
      : Immutable.fromJS(state, this._reviver)
    );
  }

    set(state, path) {
    if (this._state === state) return;
    this._state = state;
        this.emit('change', this._state, path);
  }

  get() {
    return this._state;
  }

  save(): Object {
    return this._state.toJS();
  }

  toConsole() {
    console.log(JSON.stringify(this.save())); // eslint-disable-line no-console
  }

  remove(path) {
      this.set(this._state.deleteIn(path));
  }

  cursor(path) {
    return (update) => {
        if (typeof update === "undefined") {
            return this._state.getIn(path);
        } else if (typeof update === "function") {
                return this.set(this._state.updateIn(path, update), path);
        } else {
                return this.set(this._state.setIn(path, update), path);
        }
    };
  }
};
