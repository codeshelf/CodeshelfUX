import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {WorkerSearchItem} from "./WorkerSearchItem.react.js";
import {createSearchComponent} from "../../Search/SearchFactory.react.js";

import {getWorkerSearchMutable} from '../../Search/WorkerSearch/get';
import {acChangeFilter, acSearch} from '../../Search/WorkerSearch/store';

function getIdForItem(item) { return  item.persistentId }

const WorkerSearch = createSearchComponent(WorkerSearchItem,
                                          "Enter Badge",
                                          getIdForItem);

function mapDispatch(dispatch) {
  return bindActionCreators({acChangeFilter, acSearch}, dispatch);
}

export default connect(getWorkerSearchMutable, mapDispatch)(WorkerSearch);
