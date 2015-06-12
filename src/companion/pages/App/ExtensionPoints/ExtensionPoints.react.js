import  React from "react";
import {getFacilityContext} from "data/csapi";
import {Table} from "components/common/Table";
import {RouteHandler} from "react-router";
import EditButtonLink from "components/common/EditButtonLink";
import {fromJS} from "immutable";
export default class ExtensionPoint extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            extensionPoints: []
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
//            let extensionPoints = fromJS(data);
            this.setState({extensionPoints: data});
        });
    }

    render() {
        let {extensionPoints} = this.state;
        return (<div>
                <Table results={extensionPoints} columnMetadata={this.columnMetadata} />
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
