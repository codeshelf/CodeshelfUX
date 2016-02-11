var React = require('react');
import {Select, Checkbox} from 'components/common/Form';
var _ = require('lodash');

var {IBox, IBoxBody}  = require('components/common/IBox');
import {Row, Col} from 'components/common/pagelayout';

import IssuesByItem from './IssuesByItem';
import IssuesByWorker from './IssuesByWorker';
import Immutable, {List, Map, fromJS, Set} from 'immutable';

export default class IssuesIBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "groupBy": "item",
            "resolved": false
        };
    }

    handleGroupBy(e) {
        let groupBy = e.target.value;
        this.setState({groupBy: groupBy});
    }

    handleResolved(e) {
        this.setState({resolved: e.target.checked});
    }

    render() {
        let {type, filter} = this.props;
        let {groupBy, resolved} = this.state;
        return (
                   <IBox>
                      <IBoxBody>
                          <form role="form">
                          <Row>
                              <Col sm={6} lg={3}>
                                  <Select id="groupBy" label='Group By' value={groupBy} options={[{value: "item", label: "Item"}, {value:"worker", label: "Worker"}]} onChange={this.handleGroupBy.bind(this)}/>
                              </Col>
                            </Row>
                          </form>
                          {
                              (groupBy === "item") ?
                          <IssuesByItem  groupBy="item" type={type} resolved={resolved} filter={filter} />
                                :
                          <IssuesByWorker groupBy="worker" type={type} resolved={resolved} filter={filter} />
                          }
                      </IBoxBody>
                      </IBox>
              );
    }

};
