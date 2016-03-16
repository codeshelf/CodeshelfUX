import  React from "react";
import {Button} from "components/common/bootstrap";
import EDIForm from "./EDIForm";
import {Map} from "immutable";
import {getAPIContext} from "data/csapi";
import exposeRouter, {toURL} from 'components/common/exposerouter';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getEdiGatewayMutable} from './get';
import {acUpdateEdiGatewayForm, acLoadEdiGateway, acAddEdiGateway,
  acEditEdiGateway, acStoreSelectedEdiGatewayForm} from './store';


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

        constructor(props) {
            super(props);
            this.formMetadata = domainIdMap.get(this.props.params.id, sftpOrderFormMetadata);
            this.id = this.props.params.id;
        }

        componentWillMount() {
            this.findSelectedEdiForm(this.props);
        }
        componentWillReceiveProps(newProps) {
            this.findSelectedEdiForm(newProps);
        }

        findSelectedEdiForm(props) {
            let {id} = this.props.params;
            let list = this.props.items.get('data');
            let listItem = list.find((u) => {
                return u["domainId"] == id;
            });
            //let config = listItem["providerCredentials"] || "{}";
            //let active  = listItem["active"] || false;
            // let configJSON = new Map(JSON.parse(config))
            //     .set("domainId", id) //add domainId  and active for form
            //     .set("active", active);

            this.props.acStoreSelectedEdiGatewayForm(listItem);
        }

        render() {
            const listItem = this.props.itemForm;
            if (!listItem) {
                return null;
            }
            return (<EDIForm {...this.props} title={"Edit " + listItem["domainId"]} formData={new Map(listItem)} formMetadata={this.formMetadata}>
                       {(this.id === "DROPBOX") && <DropboxLinkButton>Link</DropboxLinkButton>}
                    </EDIForm>);
        }
    }

    function mapDispatch(dispatch) {
      return bindActionCreators({acUpdateEdiGatewayForm, acLoadEdiGateway,
        acAddEdiGateway, acEditEdiGateway, acStoreSelectedEdiGatewayForm}, dispatch);
    }

    return exposeRouter(connect(getEdiGatewayMutable, mapDispatch)(SelectedItem));
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
