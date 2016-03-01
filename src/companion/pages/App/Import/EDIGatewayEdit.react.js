import  React from "react";
import {Button} from "components/common/bootstrap";
import EDIForm from "./EDIForm";
import {Map} from "immutable";
import {getAPIContext} from "data/csapi";

const baseFormMetadata = [
    {name: "active",
    label: "Active",
     type: Boolean}
];

const baseSftpFormMetadata = baseFormMetadata.concat([
    {name: "domainId",
     label: "ID",
     hidden: true},
    {name: "host",
     label: "Host",
     required: true},
    {name: "port",
     label: "Port"},
    {name: "username",
     label: "Username",
     required: true},
    {name: "password",
     label: "Password",
     required: true}
]);

const sftpOrderFormMetadata = baseSftpFormMetadata.concat([
    {name: "importPath",
     label: "Import Path",
     required: true},
    {name: "archivePath",
     label: "Archive Path",
     required: true}
]);

const sftpWIFormMetadata = baseSftpFormMetadata.concat([
    {name: "exportPath",
     label: "Export Path",
     required: true}
]);


const ironMQFormMetadata = baseFormMetadata.concat([
    {name: "domainId",
     label: "ID",
     hidden: true},
    {name: "projectId",
     label: "Project ID",
     required: true},
    {name: "token",
     label: "Token",
     required: true}
]);

const dropboxFormMetadata = baseFormMetadata.concat([
    {name: "domainId",
     label: "ID",
     hidden: true},
    {name: "code",
     label: "Activation",
     required: true}
]);


const domainIdMap = new Map({"IRONMQ": ironMQFormMetadata,
                             "DROPBOX": dropboxFormMetadata,
                             "SFTPORDERS": sftpOrderFormMetadata,
                             "SFTPWIS": sftpWIFormMetadata});

function toSelectedListItem() {
    class SelectedItem extends React.Component {
        render() {
            let {id} = this.props.params;
            let {list} = this.props;
            let listItem = list.find((u) => {
                return u.get("domainId") == id;
            });
            let config = listItem.get("providerCredentials", "{}");
            let active  = listItem.get("active", false);
            let configJSON = new Map(JSON.parse(config))
                .set("domainId", id) //add domainId  and active for form
                .set("active", active);

            let formMetadata = domainIdMap.get(id, sftpOrderFormMetadata);
            return (<EDIForm title={"Edit " + listItem.get("domainId")} initialFormData={configJSON} formMetadata={formMetadata}>
                       {(id === "DROPBOX") && <DropboxLinkButton>Link</DropboxLinkButton>}
                    </EDIForm>);
        }
    }
    return SelectedItem;
}

export default toSelectedListItem();

class DropboxLinkButton extends React.Component {

    handleClick() {
        return getAPIContext().startDropboxLink().then((urlObj) => {
                window.open(urlObj.url, '_blank');
            window.focus();
        });
    }

    render() {
        return (<Button type="button" onClick={this.handleClick.bind(this)}>Link</Button>);
    }
}
