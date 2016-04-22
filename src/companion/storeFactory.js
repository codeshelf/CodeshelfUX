import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import filter from 'redux-storage-decorator-filter';




export function createApplicationStore(rootReducer,  storageConfig = {}) {
  const {key = null,
         pathsToSync = [],
         actionWhitelist = [],
         actionBlacklist = [],
         version = null} = storageConfig;

  let middlewareArgs = [thunk];

  let storageEngine = null;
  if (key) {
    storageEngine = filter(
      createEngine(key),
      pathsToSync);

    const storageMiddleware = storage.createMiddleware(
      storageEngine,
      []/* black list action */,
      actionWhitelist /* white list action */);
    middlewareArgs.push(storageMiddleware);
  }

  middlewareArgs.push(createLogger());

  // create a store that has redux-thunk middleware enabled
  const createStoreWithMiddleware = compose(
    applyMiddleware.apply(this, middlewareArgs),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  let store = createStoreWithMiddleware(rootReducer);

  if (key) {
    const STORAGE_KEY_VERSION = key + "-version";

    // load data from local storage but only if version is greater than actual version
    const versionInStorage = localStorage.getItem(STORAGE_KEY_VERSION);

    if (versionInStorage >= version) {
      storage.createLoader(storageEngine)(store);
    } else {
      localStorage.removeItem(key);
      localStorage.setItem(STORAGE_KEY_VERSION, version);
    }
  }

  return store;
}
