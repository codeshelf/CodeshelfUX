import  React from "react";
import {getFacilityContext} from "data/csapi";
import {Table} from "components/common/Table";
import {RouteHandler} from "react-router";
import {Row, Col} from "components/common/pagelayout";
import {EditButtonLink, AddButtonLink} from "components/common/TableButtons";
import {Button} from "react-bootstrap";
import Icon from "react-fa";
import {fromJS, Map, List} from "immutable";
import immstruct from "immstruct";

const allTypes = fromJS([
    {value: "OrderImportBeanTransformation",           label: "Order Import Record Change"},
    {value: "OrderImportHeaderTransformation",         label: "Order Import Header Change"},
    {value: "OrderImportCreateHeader",                 label: "Order Import Header Add"},
    {value: "OrderImportLineTransformation",           label: "Order Import Line Change"},
    {value: "OrderOnCartContent",                      label: "Export OrderOnCart Change"},
    {value: "WorkInstructionExportContent",            label: "Export Work Inst. Content"},
    {value: "WorkInstructionExportCreateHeader",       label: "Export Work Inst. Header Add"},
    {value: "WorkInstructionExportCreateTrailer",      label: "Export Work Inst. Trailer Add"},
    {value: "WorkInstructionExportLineTransformation", label: "Export Work Inst. Line Change"}
]);

const typeLabelMap = allTypes.reduce((map, option) => {
        return map.set(option.get("value"), option.get("label"));
    }, Map());

export default class ExtensionPoints extends React.Component{

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
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Edit
            }

        ];

    }

    componentWillMount() {
        getFacilityContext().getExtensionPoints().then((data) => {
            this.state.extensionPoints.cursor().update((pts) =>{
                let newList = pts.clear().concat(fromJS(data));
                return newList;
            });
        });
    }

    render() {
        let {extensionPoints} = this.state;
        let list = extensionPoints.cursor().deref();

        let currentTypes = list.map((pt) => pt.get("type"));
        let availableTypes = allTypes.filter((t) => {
            return currentTypes.includes(t.get("value")) == false;
        });
        return (<div>
                <Row>
                    <Col sm={12}>
                        <div className="pull-right">
                            <AddButtonLink to="extensionpointadd" disabled={(availableTypes.count() <= 0)}>
                            </AddButtonLink>
                        </div>
                    </Col>
                </Row>
                <Table results={list} columnMetadata={this.columnMetadata} />
                <RouteHandler availableTypes={availableTypes} formMetadata={this.columnMetadata} extensionPoints={extensionPoints} />
                </div>
        );
    }
};

class Type extends React.Component {
    render() {
        var formData = this.props.rowData;
        var type = formData.get("type");
        return (<span data-type={type}>{typeLabelMap.get(type)}</span>);
    }

}

class Edit extends React.Component {
    render() {
        var formData = this.props.rowData;
        var persistentId = formData.get("persistentId");
        return (<EditButtonLink
                 to="extensionpointedit"
                 params={{extensionPointId: persistentId}}>
                </EditButtonLink>);
    }

}
