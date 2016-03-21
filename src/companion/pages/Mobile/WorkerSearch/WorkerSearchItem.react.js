import {Component} from 'react';
import {DateDisplay} from "../../DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Search/SearchItem.react.js";

export class WorkerSearchItem extends Component {

  render() {
    const {domainId, updated, firstName, lastName, filterText} = this.props;
    const subtitle = <span>{firstName} {lastName} - <DateDisplay date={updated} /></span>;
    return (
        <SearchItem to={`workers/${encodeURIComponent(domainId)}`}
         title={renderMatch(domainId, filterText)}
         subtitle={subtitle} />
    );
  }
}
