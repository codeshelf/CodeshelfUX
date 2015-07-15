import State from '../lib/state';
import storage from "../lib/storage";
import {fromJS} from "immutable";
const initialState = require('../data/initialstate');

if (process.env.IS_BROWSER) {
   window._appState = initialState;

}
/*
const initialState = process.env.IS_BROWSER
  ? window._appState
  : require('../data/initialstate');
*/



export const state = new State(initialState);
export const preferences = state.cursor(["preferences"]);

if (process.env.IS_BROWSER) {
    let storedPreferences = storage.get("preferences");
    if (storedPreferences) {
        let versionedPreferences =  fromJS(storedPreferences);
        let expectedVersion = preferences().get("version");
        let storedVersion = versionedPreferences.get("version", "1.0");

        var [storedMajor, storedMinor] = storedVersion.split(".");
        var [expectedMajor, expectedMinor] = expectedVersion.split(".");
        if (storedMajor === expectedMajor) {
            preferences((oldPreferences) => {
                return oldPreferences.mergeDeep(storedPreferences)
                    .set("version", expectedVersion);
            });
        } else {
            console.log("Stored preferences are not compatible with application, resetting");
        }

    }
}

export const $pendingActionsCursor = state.cursor(['$pendingActions']);
export const $subscriptionsCursor = state.cursor(['$subscriptions']);
export const authCursor = state.cursor(['auth']);
export const i18nCursor = state.cursor(['i18n']);

export const selectedFacilityCursor = state.cursor(['selectedFacility']);
export const facilitiesCursor = state.cursor(['facilities']);
export const itemsCursor = state.cursor(['items']);
export const userCursor = state.cursor(['user']);
export const selectedWorkerCursor = state.cursor(['selectedWorkerForm']);
export const workersCursor = state.cursor(['workers']);
