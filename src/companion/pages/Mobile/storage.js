import * as orderDetail from '../Detail/OrderDetail/store';
import * as workerDetail from '../Detail/WorkerDetail/store';
import * as cartDetail from '../Detail/CartDetail/store';
import * as detailFactory from '../Detail/storeFactory';
import * as list from '../../components/common/list/store';

export const PERSIST_STATE_PART = [
  ...orderDetail.PERSIST_STATE_PART,
  ...workerDetail.PERSIST_STATE_PART,
  ...cartDetail.PERSIST_STATE_PART,
  ...list.PERSIST_STATE_PART,
];

export const ACTIONS = [
  detailFactory.SETTING_PROPERTY_VISIBILITY,
  detailFactory.SETTING_PROPERTY_ORDER,
  list.CHANGE_COLUMN,
  list.MOVE_COLUMNS,
];

// If you change shape of anything in PERSIST_STATE_PART
// then increase this number
export const VERSION = 11;

export const STORAGE_KEY = 'codeshelfus-mobile-web';
export const STORAGE_KEY_VERSION = STORAGE_KEY + "-version";
