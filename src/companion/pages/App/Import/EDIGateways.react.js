import {getAPIContext} from "data/csapi";
import {properties, keyColumn} from "data/types/EdiGateway";

const title = "EDI Gateways";
const stateProp = "edigateways";
function editRouteFactory(row) {
    return {    to: "edigatewayedit",
                params: {id: row.get(keyColumn)}
           };
};

export default class EdiGateways extends React.Component {
    render() {
        return (<ListPage
                 appState={this.props.state}
                 title="EDI Gateways"
                 stateProp="edigateways"
                 editRouteFactory={editRouteFactory}
                 listSource={getAPIContext().getEdiGateways}
                 listProperties={properties}
                 keyProperty={keyColumn}
                 /> );
    }
};

import  React from "react";
import {RouteHandler} from "react-router";
import DocumentTitle from "react-document-title";
import {Button} from "components/common/bootstrap";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
import {fromJS, List} from "immutable";

function newState(value) {
    var newState = {};
    newState[stateProp] = value;
    return newState;
}



class ListPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = newState(List());

    }

    updateList() {
        return this.props.listSource().then((list) => {
            let immutableList = fromJS(list);
            this.setState(newState(immutableList));
            return immutableList;
        });
    }

    componentWillMount() {
        this.updateList();
    }

    componentWillReceiveProps() {
        this.updateList();
    }

    render() {
        let {appState, editRouteFactory} = this.props;
        let list = this.state[stateProp];
        let columnsCursor  = appState.cursor(["preferences", stateProp, "table", "columns"]);
        let columnSortSpecsCursor = appState.cursor(["preferences", stateProp, "table", "sortSpecs"]);
        let columnMetadata = ListView.toColumnMetadataFromProperties(properties);
        let rowActionComponent = ListManagement.toEditButton(editRouteFactory);
        return (<DocumentTitle title={title}>
                <div>
                    <ListManagement
                        results={list}
                        keyColumn={keyColumn}
                        columnMetadata={columnMetadata}
                        rowActionComponent={rowActionComponent}
                        columns={columnsCursor}
                        sortSpecs={columnSortSpecsCursor} />

                     <RouteHandler list={list}/>
                </div>
                </DocumentTitle>
               );
    }
};
