import State from '../lib/state';

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
export const $pendingActionsCursor = state.cursor(['$pendingActions']);
export const authCursor = state.cursor(['auth']);
export const i18nCursor = state.cursor(['i18n']);
export const selectedFacilityCursor = state.cursor(['selectedFacility']);
export const blockedWorkCursor = state.cursor(['blockedwork']);
export const itemsCursor = state.cursor(['items']);
export const userCursor = state.cursor(['user']);
export const selectedWorkerCursor = state.cursor(['selectedWorkerForm']);
export const workersCursor = state.cursor(['workers']);
