import  React from "react";
import DocumentTitle from "react-document-title";
import {Map} from "immutable";
import {Button} from "components/common/Form";
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import {getAPIContext} from "data/csapi";
import exposeRouter, {toURL} from 'components/common/exposerouter';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getEdiGatewayMutable} from './get';
import {acUpdateEdiGatewayForm, acLoadEdiGateway, acAddEdiGateway,
  acEditEdiGateway, acStoreSelectedEdiGatewayForm} from './store';

class EDIForm extends React.Component{

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        // if (initialFormData && initialFormData.get("passwordEnc")) {
        //     formData = initialFormData.set("password", "********");
        // }
    }

    handleSubmit(formData) {
        var params = formData.toJS();
        //don't save password if it hasn't been edited
        if (params.password && params.password.replace(/\*+/, '').length == 0) { //all * replaced
            delete params.password;
        }
        return this.props.acEditEdiGateway(params);
    }

    handleChange(field, value) {
        this.props.acUpdateEdiGatewayForm(field, value);
    }

    render() {
        let {title, formMetadata, formData} = this.props;
        return (
          <DocumentTitle title={title}>
            <ModalForm title={title}
              returnRoute={toURL(this.props, "../edigateways")}
              onSave={this.handleSubmit.bind(this, formData)}
              formData={formData}>
            <FormFields
              formMetadata={formMetadata}
              formData={formData}
              handleChange={this.handleChange}/>
            {this.props.children}
            </ModalForm>
          </DocumentTitle>
        );
    }
};

function mapDispatch(dispatch) {
  return bindActionCreators({acUpdateEdiGatewayForm, acLoadEdiGateway,
    acAddEdiGateway, acEditEdiGateway, acStoreSelectedEdiGatewayForm}, dispatch);
}

export default connect(getEdiGatewayMutable, mapDispatch)(EDIForm);
