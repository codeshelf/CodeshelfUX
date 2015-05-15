import IssuesByItem from '../IssuesByItem';
import React from 'react/addons';
import {findAllTextNodes} from 'lib/testutils';
import Immutable, {fromJS} from 'immutable';
import _ from 'lodash';
import {List, Map} from 'immutable';
import Chance from 'chance';

let chance = new Chance();

var TU = React.addons.TestUtils;
describe('IssuesByItem', () => {
    it('renders expand', () => {

        let generatedIssue = fromJS({orderId: "ORDERIDTEST"});

        let issuesByItem = fromJS([
            {"id": "uuid",
             "item": "skuId",
             "issueCount": 393}
        ]);

        function expandSource(itemData) {
            if (itemData == null) throw "item data passed to expand function was null";
            return List.of(generatedIssue);
        }

        var component = TU.renderIntoDocument(<IssuesByItem issues={issuesByItem} expand={(row) => {
            return (Immutable.is(row, issuesByItem.get(0)));
        } } expandSource={expandSource}/>);
        expect(findAllTextNodes(component)).toContain(generatedIssue.get("orderId"));
    });

    it('renders multiple item groups', () =>{
        let issuesByItem = List(_.range(12).map((i) => {
            return Map({
                item: {gtin: chance.string({length: 12, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'})},
                issueCount: chance.integer()
            });
        }));
        var component = TU.renderIntoDocument(<IssuesByItem issues={issuesByItem}  expandSource={() => new List()}/>);

    });
});
