import {Record, Map} from 'immutable';

import {createStore} from '../ListManagement/storeFactory';

const store = createStore({
                          storeName: 'dailyMetrics',
                          getItems: 'getMetrics',
                          useFacility: true,
                          });

export const acLoadMetrics = store.acLoadItems;
export const acUnsetError = store.acUnsetError;
export const dailyMetricsReducer = store.listReducer;
