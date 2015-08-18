import  React from "react";
import {Button} from "components/common/bootstrap";
import EDIForm from "./EDIForm";
import {Map} from "immutable";
import {getFacilityContext} from "data/csapi";

const baseFormMetadata = [{name: "domainId",
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
                         ];

const sftpOrderFormMetadata = baseFormMetadata.concat([
                      {name: "importPath",
                       label: "Import Path",
                       required: true},
                      {name: "archivePath",
                       label: "Archive Path",
                       required: true}
]);

const sftpWIFormMetadata = baseFormMetadata.concat([
    {name: "exportPath",
     label: "Export Path",
     required: true}
]);


const ironMQFormMetadata = [{name: "domainId",
                             label: "ID",
                                     hidden: true},
                                     {name: "projectId",
                             label: "Project ID",
                             required: true},
                            {name: "token",
                             label: "Token",
                             required: true}
                     ];

const dropboxFormMetadata = [{name: "domainId",
                              label: "ID",
                                      hidden: true},
                                      {name: "code",
                             label: "Activation",
                                 required: true}
                            ];


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
            let configJSON = new Map(JSON.parse(config))
                                 .set("domainId", id); //add domainId for form

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
        return getFacilityContext().startDropboxLink().then((urlObj) => {
                window.open(urlObj.url, '_blank');
            window.focus();
        });
    }

    render() {
        return (<Button type="button" onClick={this.handleClick.bind(this)}>Link</Button>);
    }
}
