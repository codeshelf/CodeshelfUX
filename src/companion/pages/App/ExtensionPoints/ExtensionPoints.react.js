import  React from "react";
import {getFacilityContext} from "data/csapi";
import {Table} from "components/common/Table";
import {RouteHandler} from "react-router";
import EditButtonLink from "components/common/EditButtonLink";
import {fromJS} from "immutable";
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
        return (<div>
                <Table results={list} columnMetadata={this.columnMetadata} />
                <RouteHandler formMetadata={this.columnMetadata} extensionPoints={extensionPoints} />
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
