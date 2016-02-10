import {Table} from '../Table.react.js';
import React from 'react/addons';
import ReactDOM from 'react-dom';
import {findAllTextNodes} from 'lib/testutils';
import Immutable, {List, Map} from 'immutable';

var TU = React.addons.TestUtils;
describe('Table', () => {
  it('plain table renders without error', () => {
      TU.renderIntoDocument(<Table />);
  });

  it('table renders columnName', () => {
      let columnName = "item";

      let testData = {};
      testData[columnName] = "testdata";
      var component = TU.renderIntoDocument(<Table results={[testData]}/>);
      var textNodes = findAllTextNodes(component);
      expect(textNodes).toContain(columnName);
  });

  it('table renders custom headers', () => {
      let label = "UPC";
      let columnMetadata = [
          {
              columnName: "item",
              displayName: label
          }
      ];
      let testData = Map({"item": "a", "eventCount": 2});
      var component = TU.renderIntoDocument(<Table columns={List.of("item")} columnMetadata={columnMetadata} results={List.of(testData)}/>);
      var textNodes = findAllTextNodes(component);
      expect(textNodes).toContain(label);
  });

  it('shows row detail for expand', () => {
      let label = "UPC";
      let columnMetadata = [
          {
              columnName: "item",
              displayName: label
          }
      ];
      let testData = Map({"item": "a", "eventCount": 2, "showIfExpanded": "TestExpand"});
      let expandComponent = TestExpandComponent;

      var component = TU.renderIntoDocument(<Table columns={["item"]} columnMetadata={columnMetadata} results={List.of(testData)} expand={(row) => {
          return Immutable.is(row, testData);
      }} ExpandComponent={expandComponent}/>);

      console.debug(ReactDOM.findDOMNode(component));

      var textNodes = findAllTextNodes(component);
      expect(textNodes).toContain("TestExpand");
  });


});

class TestExpandComponent extends React.Component {
    render() {
        return <div>{this.props.row.get("showIfExpanded")}</div>;
    }
}
