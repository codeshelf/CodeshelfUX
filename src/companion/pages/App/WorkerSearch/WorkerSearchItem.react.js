import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../../DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Search/SearchItem.react.js";
import {Link} from '../../links';
import Icon from 'react-fa';

export class WorkerSearchItem extends Component {

  render() {
    const {domainId, updated, firstName, lastName, filterText} = this.props;
    const subtitle = <span>{firstName} {lastName} - <DateDisplay date={updated} /></span>;
    return (
      <Link to={`worker/${encodeURIComponent(domainId)}`}>
        <tr>
            <td>{renderMatch(domainId, filterText)}</td>
            <td>{subtitle}</td>
            <td><Icon name="chevron-right"/></td>
        </tr>
      </Link>
    );
  }
}
