import  React from "react";
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import DocumentTitle from "react-document-title";

import {getFacilityContext} from "data/csapi";
import ListManagement from "components/common/list/ListManagement";
import {Row, Col} from "components/common/pagelayout";
import {EditButtonLink, AddButtonLink} from "components/common/TableButtons";
import {Button} from "react-bootstrap";
import Icon from "react-fa";
import immstruct from "immstruct";
import {fromJS, Map, List} from "immutable";
import {types, keyColumn} from "data/types/ExtensionPoint";

const title = "Extension Points";
const addRoute = "extensionpointadd";
const editRoute = "extensionpointedit";
const allTypes = fromJS(types);
const typeLabelMap = allTypes.reduce((map, option) => {
        return map.set(option.get("value"), option.get("label"));
}, Map());
function toAvailableTypes(list, allTypes) {
    let currentTypes = fromJS(list).map((pt) => pt.get("type"));
    let availableTypes = allTypes.filter((t) => !currentTypes.includes(t.get("value")));
    return availableTypes;
}
class Type extends React.Component {
    render() {
        var formData = this.props.rowData;
        var type = formData.get("type");
        return (<span data-type={type}>{typeLabelMap.get(type)}</span>);
    }

}

function editRouteFactory(row) {
    return {
        to: editRoute,
        params: {extensionPointId: row.get("persistentId")}
    };
}


class ExtensionPoints extends React.Component{

    constructor(props) {
        super(props);

        //use a cursor to track changes to the list of extensionpoints
        let structure = immstruct("extensionpoints", []);
        structure.on('swap', (newStruct, oldStruct, keyPath) => {
            this.forceUpdate();
        });

        this.state = {
            extensionPoints: structure
        };
        this.rowActionComponent = ListManagement.toEditButton(editRouteFactory);
        this.columnMetadata = [
            {
                columnName: "type",
                displayName: "Type",
                customComponent: Type
            },
            {
                columnName: "active",
                displayName: "Active"
            }
        ];
        this.handleExtensionPointUpdate = this.handleExtensionPointUpdate.bind(this);
        this.handleExtensionPointAdd = this.handleExtensionPointAdd.bind(this);
    }

    componentWillMount() {
        getFacilityContext().getExtensionPoints().then((data) => {
            this.state.extensionPoints.cursor().update((pts) =>{
                let newList = pts.clear().concat(fromJS(data));
                return newList;
            });
        });
    }

    handleExtensionPointUpdate(extensionPoint) {
        let {extensionPoints} = this.state;
        extensionPoints.cursor().update((pts) => {
            let index = pts.findIndex((p) => p.get("persistentId") === extensionPoint.get("persistentId"));
            return pts.set(index, extensionPoint);
        });
        return extensionPoint;
    }

    handleExtensionPointAdd(extensionPoint) {
        let {extensionPoints} = this.state;
        extensionPoints.cursor().update((list) =>{
            return list.push(fromJS(extensionPoint));
        });
    }

    render() {
        let {extensionPoints} = this.state;
        let list = extensionPoints.cursor().deref();
        let extensionPointId = this.props.router.getCurrentParams().extensionPointId;
        let extensionPoint = null;
        if (extensionPointId) {
            extensionPoint = extensionPoints.cursor().deref().find((extensionPoint) => extensionPoint.get("persistentId") === extensionPointId);
        }

        let {rowActionComponent, columnMetadata} = this;
        let availableTypes = toAvailableTypes(list, allTypes);
        let addButtonRoute = (availableTypes.count() <= 0) ? null : addRoute;
        let lastRoute = this.props.router.getCurrentRoutes().slice(-1)[0];
        return (<DocumentTitle title={title}>
                    <div>
                        <ListManagement
                            results={list}
                            keyColumn={keyColumn}
                            columnMetadata={columnMetadata}
                            rowActionComponent={rowActionComponent}
                            addButtonRoute={addButtonRoute} />
                         {(lastRoute.name === addRoute || lastRoute.name == editRoute)
                          ? <RouteHandler
                              availableTypes={availableTypes}
                              returnRoute="extensionpoints"
                              onExtensionPointUpdate={this.handleExtensionPointUpdate}
                              onAdd={this.handleExtensionPointAdd}
                              extensionPoint={extensionPoint}/>
                           : null
                         }
                    </div>
                </DocumentTitle>
        );
    }
};

ExtensionPoints.propTypes = {
    router: React.PropTypes.func
};

export default exposeRouter(ExtensionPoints);
