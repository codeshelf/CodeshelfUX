import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {WorkerSearchItem} from "./WorkerSearchItem.react.js";
import {createSearchComponent} from "../Search/SearchFactory.react.js";

import {getWorkerSearch} from './get';
import {acChangeFilter, acSearch} from './store';
import {DateDisplay} from "../DateDisplay.react.js";

function getIdForItem(item) { return  item.persistentId }

const WorkerSearch = createSearchComponent(WorkerSearchItem, "Enter Badge", getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getWorkerSearch, mapDispatch)(WorkerSearch);
