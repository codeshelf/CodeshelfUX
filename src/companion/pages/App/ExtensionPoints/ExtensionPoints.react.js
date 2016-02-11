import  React from "react";
import exposeRouter, {toURL} from 'components/common/exposerouter';
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
import ConfirmAction from 'components/common/ConfirmAction';


const title = "Extension Points";
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


function createRowActionComponent(onActionComplete, props) {
  function editRouteFactory(row) {
    return {
      to: toURL(props, 'extensionpoints/' + row.get("persistentId"))
    };
  }

  class ScheduledJobActions extends React.Component {

        delete(rowData) {
            return getFacilityContext().deleteExtensionPoint(rowData.toJS()).then(() => {
                onActionComplete();
            });
        }

        render() {
            var {rowData}  = this.props;
            var type = rowData.get("type");
            var C = ListManagement.toEditButton(editRouteFactory);
            return (
            <div sytle={{whiteSpace: "nowrap"}}>
                    <C rowData={rowData} />
                    <ConfirmAction
                        onConfirm={this.delete.bind(this, rowData)}
                        id="delete"
                        style={{marginLeft: "0.5em"}}
                        confirmLabel="Delete"
                        confirmInProgressLabel="Deleting"
                        instructions={`Click 'Delete' to remove ${type} job`}
                        title="Delete">
                        <Icon name="trash" />
                    </ConfirmAction>
                </div>);
        }

    }
    return ScheduledJobActions;
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
        this.loadExtensionPoints = this.loadExtensionPoints.bind(this);
        this.handleExtensionPointUpdate = this.handleExtensionPointUpdate.bind(this);
        this.handleExtensionPointAdd = this.handleExtensionPointAdd.bind(this);
        this.handleExtensionPointDelete = this.handleExtensionPointDelete.bind(this);
      this.rowActionComponent = createRowActionComponent(this.loadExtensionPoints, this.props);
    }

    componentWillMount() {
        this.loadExtensionPoints();
    }

    loadExtensionPoints() {
        getFacilityContext().getExtensionPoints().then((data) => {
            this.state.extensionPoints.cursor().update((pts) =>{
                let newList = pts.clear().concat(fromJS(data));
                return newList;
            });
        });
    }

    handleExtensionPointDelete(extensionPoint) {
        let {extensionPoints} = this.state;
        extensionPoints.cursor().update((pts) => {
            let index = pts.findIndex((p) => p.get("persistentId") === extensionPoint.get("persistentId"));
            return pts.delete(index);
        });
        return extensionPoint;
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
        const addRoute = toURL(this.props, "extensionpoints/new");
        let {extensionPoints} = this.state;
        let list = extensionPoints.cursor().deref();
        let extensionPointId = this.props.params.extensionPointId;
        let extensionPoint = null;
        if (extensionPointId) {
            extensionPoint = extensionPoints.cursor().deref().find((extensionPoint) => extensionPoint.get("persistentId") === extensionPointId);
        }

        let {rowActionComponent, columnMetadata} = this;
        let availableTypes = toAvailableTypes(list, allTypes);
        let addButtonRoute = (availableTypes.count() <= 0) ? null : addRoute;
        let lastRoute = this.props.routes.slice(-1)[0];
        return (<DocumentTitle title={title}>
                    <div>
                        <ListManagement
                            results={list}
                            keyColumn={keyColumn}
                            columnMetadata={columnMetadata}
                            rowActionComponent={rowActionComponent}
                            addButtonRoute={addButtonRoute} />
                         {this.props.children && React.cloneElement(this.props.children, {
                              availableTypes:availableTypes,
                           returnRoute: toURL(this.props, "../extensionpoints"),
                              onExtensionPointUpdate:this.handleExtensionPointUpdate,
                              onAdd:this.handleExtensionPointAdd,
                           extensionPoint:extensionPoint})}
                    </div>
                </DocumentTitle>
        );
    }
};

ExtensionPoints.propTypes = {
    router: React.PropTypes.object.isRequired
};

export default exposeRouter(ExtensionPoints);
