import  React from "react";
import SFTPForm from "./SFTPForm";
import {Map} from "immutable";
const formMetadata = SFTPForm.appendMetadata([
                      {name: "importPath",
                       label: "Import Path",
                       required: true},
                      {name: "archivePath",
                       label: "Archive Path",
                       required: true}
]);


function toSelectedListItem() {
    class SelectedItem extends React.Component {
        render() {
            let {id} = this.props.params;
            let {list} = this.props;
            let listItem = list.find((u) => {
                return u.get("domainId") == id;
            });
            let config = listItem.get("providerCredentials", "{}");
            let configJSON = new Map(JSON.parse(config))
                                 .set("domainId", id); //add domainId for form


            let ComponentForm = SFTPForm; //or ironmq or dropbox <ComponentForm title={"Edit " + listItem.get("domainId")} initialFormData={configJSON} formMetadata={formMetadata}/>;
        }
    }
    return SelectedItem;
}


export default toSelectedListItem();
