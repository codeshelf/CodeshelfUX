import  React from "react";
import DocumentTitle from "react-document-title";
import {Map} from "immutable";
import {Button} from "components/common/Form";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
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


export default class name extends React.Component{

    constructor(props) {
        super(props);
    }

    static appendMetadata(toAppend) {
        return baseFormMetadata.concat(toAppend);
    }

    handleSubmit(formData) {
        return getFacilityContext().updateEDISFTPOrders(formData.toJS());
    }

    render() {
        let {title, formMetadata} = this.props;
            let formData = Map({
            domainId: "SFTPORDERS",
            host: "sftp.codeshelf.com",
            username: "test",
            password: "m80isrq411",
            importPath: "/out",
            archivePath: "/out/archive"
        });
            return (<DocumentTitle title={title}>
                <ModalForm title={"Configure" + title}
                        returnRoute="edigateways"
                        onSave={this.handleSubmit.bind(this, formData)}
                        formData={formData}>

                    <FormFields
                        formMetadata={formMetadata}
                        formData={formData}
                        handleChange={() =>{}}/>
                </ModalForm>
                </DocumentTitle>
               );
    }
};
