import  React from "react";
import {getFacilityContext} from "data/csapi";
import {Table} from "components/common/Table";
import {RouteHandler} from "react-router";
import {Row, Col} from "components/common/pagelayout";
import {EditButtonLink, AddButtonLink} from "components/common/TableButtons";
import {Button} from "react-bootstrap";
import Icon from "react-fa";
import {fromJS, List} from "immutable";
import immstruct from "immstruct";

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
                displayName: "Type"
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

        this.allTypes = [{value: "OrderImportBeanTransformation"},
	                     {value: "OrderImportHeaderTransformation"},
	                     {value: "OrderImportLineTransformation"}];

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
        let allTypes = List(this.allTypes);
        let availableTypes = allTypes.filter((t) => {
            return currentTypes.includes(t.value) == false;
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

class Edit extends React.Component {
    render() {
        var formData = this.props.rowData;
        var persistentId = formData.get("persistentId");
        return (<EditButtonLink
                 to="extensionpointdisplay"
                 params={{extensionPointId: persistentId}}>
                </EditButtonLink>);
    }

}
