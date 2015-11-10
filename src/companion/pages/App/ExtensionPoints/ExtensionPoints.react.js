import  React from "react";
import {RouteHandler} from "react-router";
import exposeRouter from 'components/common/exposerouter';
import {getFacilityContext} from "data/csapi";
import ListManagement from "components/common/list/ListManagement";
import {Row, Col} from "components/common/pagelayout";
import {EditButtonLink, AddButtonLink} from "components/common/TableButtons";
import {Button} from "react-bootstrap";
import Icon from "react-fa";
import {fromJS, Map, List} from "immutable";
import immstruct from "immstruct";
import ExtensionPointEditButtonLink from "./ExtensionPointEditButton";


const allTypes = fromJS([
    {value: "OrderImportBeanTransformation",           label: "Import Order Record Change"},
    {value: "OrderImportHeaderTransformation",         label: "Import Order Header Change"},
    {value: "OrderImportCreateHeader",                 label: "Import Order Header Add"},
    {value: "OrderImportLineTransformation",           label: "Import Order Line Change"},
    {value: "OrderOnCartContent",                      label: "Export OrderOnCart Change"},
    {value: "WorkInstructionExportContent",            label: "Export Work Inst. Content"},
    {value: "WorkInstructionExportCreateHeader",       label: "Export Work Inst. Header Add"},
    {value: "WorkInstructionExportCreateTrailer",      label: "Export Work Inst. Trailer Add"},
    {value: "WorkInstructionExportLineTransformation", label: "Export Work Inst. Line Change"}
]);

const typeLabelMap = allTypes.reduce((map, option) => {
        return map.set(option.get("value"), option.get("label"));
    }, Map());

class Type extends React.Component {
    render() {
        var formData = this.props.rowData;
        var type = formData.get("type");
        return (<span data-type={type}>{typeLabelMap.get(type)}</span>);
    }

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

        let currentTypes = list.map((pt) => pt.get("type"));
        let availableTypes = allTypes.filter((t) => {
            return currentTypes.includes(t.get("value")) == false;
        });
        let extensionPointId = this.props.router.getCurrentParams().extensionPointId;
        let extensionPoint = null;
        if (extensionPointId) {
            extensionPoint = extensionPoints.cursor().deref().find((extensionPoint) => extensionPoint.get("persistentId") === extensionPointId);
        }
        let addButtonRoute = (availableTypes.count() <= 0) ? null : "extensionpointadd";
        return (<div>
                    <ListManagement
                        columnMetadata={this.columnMetadata}
                        addButtonRoute={addButtonRoute}
                        rowActionComponent={ExtensionPointEditButtonLink}
                        results={list}
                        keyColumn="type"/>
                    <RouteHandler availableTypes={availableTypes}
                            onExtensionPointUpdate={this.handleExtensionPointUpdate}
                            onExtensionPointAdd={this.handleExtensionPointAdd}
                            extensionPoint={extensionPoint}/>
                </div>
        );
    }
};

ExtensionPoints.propTypes = {
    router: React.PropTypes.func
};

export default exposeRouter(ExtensionPoints);
