var React = require('react');
import DocumentTitle from 'react-document-title';

var _ = require('lodash');

var ibox = require('components/common/IBox');
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;

import IssuesByItem from './IssuesByItem';
import {List, Map, fromJS} from 'immutable';

export default class IssuesIBox extends React.Component {

    getIssuesByItem(itemData) {
        let details = itemData.get("details");
        return List(details).sortBy(issue => issue.orderId);
    }

    render() {
        var {title, workDetails} = this.props;

        var grouped = this.groupByItem(fromJS(workDetails));
        var first = grouped.first();

        return (<DocumentTitle title={title}>
                   <IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                          {title}
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                <div><a>By Item</a>  | <a>By Worker</a></div>
                <div><a>Resolved</a> | <a>Unresolved</a></div>

                          <IssuesByItem issues={grouped} expand={first} expandSource={this.getIssuesByItem}/>
                      </div>
                      </IBox>
                </DocumentTitle>
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
