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


export default class SFTPForm extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        let {initialFormData} = props;
        var formData = Map();
        if (initialFormData && initialFormData.get("passwordEnc")) {
            formData = initialFormData.set("password", "********");
        }

        this.state = {formData: formData};
    }

    static appendMetadata(toAppend) {
        return baseFormMetadata.concat(toAppend);
    }

    handleSubmit(formData) {
        var params = formData.toJS();
        //don't save password if it hasn't been edited
        if (params.password && params.password.replace(/\*+/, '').length == 0) { //all * replaced
            delete params.password;
        }
        return getFacilityContext().updateEdiGateway(params);
    }

    handleChange(field, value) {
        let newFormData = this.state.formData.set(field.name, value);
        this.setState({formData: newFormData});
    }



    render() {
        let {title, formMetadata} = this.props;
        let {formData} = this.state;
        return (<DocumentTitle title={title}>
                <ModalForm title={title}
                        returnRoute="edigateways"
                        onSave={this.handleSubmit.bind(this, formData)}
                        formData={formData}>

                    <FormFields
                        formMetadata={formMetadata}
                        formData={formData}
                        handleChange={this.handleChange}/>


                </ModalForm>
                </DocumentTitle>
               );
    }
};
