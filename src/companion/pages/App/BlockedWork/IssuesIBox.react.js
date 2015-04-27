var React = require('react');
import {DropdownButton, MenuItem} from 'react-bootstrap';
var _ = require('lodash');

var {IBox, IBoxBody}  = require('components/common/IBox');

import IssuesByItem from './IssuesByItem';
import {List, Map, fromJS} from 'immutable';

export default class IssuesIBox extends React.Component {
    constructor(props) {
        this.state = {
            "selectedGroup" : null
        };
    }


    getIssuesByItem(itemData) {
        let details = itemData.get("details");
        return List(details).sortBy(issue => issue.orderId);
    }

    handleSelectedGroup(expanded, rowData, rowNumber, e) {
        if (expanded) {
            this.setState({"selectedGroup" : rowData});
        }
        else {
            this.setState({"selectedGroup" : null});
        }

    }

    render() {
        var {title, workDetails} = this.props;

        var grouped = this.groupByItem(fromJS(workDetails));
        var {selectedGroup} = this.state;

        return (
                   <IBox>
                      <IBoxBody>
                          <DropdownButton title='Group By'>
                              <MenuItem eventKey='1'>Item</MenuItem>
                              <MenuItem eventKey='2'>Worker</MenuItem>
                          </DropdownButton>
                          <input type="checkbox" /> Show Resolved Only

                          <IssuesByItem onSelectedGroup={this.handleSelectedGroup.bind(this)} issues={grouped} expand={selectedGroup} expandSource={this.getIssuesByItem}/>
                      </IBoxBody>
                      </IBox>
                      );
    }

    groupByItem(workDetails) {
        var groupedDetails = workDetails.groupBy((workDetail) => {
            return (workDetail.get("sku") + ":" + workDetail.get("uom"));
        });
        var list = groupedDetails.keySeq().map((key) => {
            var sameItems = groupedDetails.get(key);
            var first = sameItems.first();
            var sku =  first.get("sku");
            var description = first.get("description") ? first.get("description"): "";
            return Map({
                key: key,
                sku: sku,
                gtin: sku,
                uom: first.get("uom"),
                description: description,
                itemDescription: description,
                issueCount: sameItems.size,
                lineCount: sameItems.size,
                details: sameItems
            });
        });

        return list;
    }

}
IssuesIBox.propTypes = {
    title: React.PropTypes.string.isRequired,
    workDetails: React.PropTypes.array.isRequired
};
