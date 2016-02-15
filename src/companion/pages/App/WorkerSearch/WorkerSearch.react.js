import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {WorkerSearchItem} from "./WorkerSearchItem.react.js";
import {createSearchComponent} from "../CartSearch/Search.react.js";

import {getWorkerSearchMutable} from '../../Mobile/WorkerSearch/get';
import {acChangeFilter, acSearch} from '../../Mobile/WorkerSearch/store';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";

function getIdForItem(item) { return  item.persistentId }

const WorkerSearch = createSearchComponent(WorkerSearchItem, "Enter Badge", getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getWorkerSearchMutable, mapDispatch)(WorkerSearch);
