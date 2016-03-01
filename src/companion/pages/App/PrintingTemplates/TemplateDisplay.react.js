import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import {Modal, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";

import Immutable, {fromJS, Record} from 'immutable';
import uuid from 'node-uuid';

// new imports redux 
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Text from "data/types/Text";

import {getPrintingTemplatesMutable} from "./get";
import {acAddTemplate, acUpdateTemplate, acStoreTemplateForm, acUpdateSelectedTemplate} from "./store";

const tmplate = new (Record({
    persistentId : "new",
    name: "",
    active: false,
    template: "",
}));

class TemplateDisplay extends Component {

    constructor() {
        super();
        this.formMetadata = [
            {name: "name", label: "Name", required: true},
            {name: "active", label: "Active", type: Boolean},
            {name: "template", label: "Template", type: Text, required: true}];
    }

    componentWillMount() {
        this.findSelectedTemplateForm(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.findSelectedTemplateForm(newProps);
    }

    findSelectedTemplateForm(props) {
        let path = props.location.pathname;
        let templateId = null;
        if (path.indexOf("new") >= 0) {
            templateId = "new";
        } else {
            templateId = props.params.templateId;
        }

        let templateForm = this.props.selectedTemplateForm;
        if (!templateForm || templateForm.get('persistentId') !== templateId) {
            if (templateId === "new") {
                templateForm = {}; //Template()
                this.props.acStoreTemplateForm(tmplate);
            } else {
                templateForm = this.props.templates.get('data').find((template) => template.persistentId === templateId);
                this.props.acStoreTemplateForm(fromJS(templateForm));
            }
        }
    }

    handleChange(formField, value) {
      this.props.acUpdateSelectedTemplate(formField.name, value);
    }

    handleSave() {
        const selectedTemplateForm = this.props.selectedTemplateForm;
        const id = selectedTemplateForm.persistentId;
        let promise;
        if (id === NEWID) {
            promise = this.props.acAddTemplate(selectedTemplateForm.set("persistentId", null));
            this.props.acStoreTemplateForm(tmplate); //Template()
        } else {
            promise = this.props.acUpdateTemplate(selectedTemplateForm);
        }
        return promise;
    }


    render() {
      const formData = this.props.selectedTemplateForm;
      return (<ModalForm title="Edit Template" formData={formData} returnRoute={toURL(this.props, "../templates")}
                onSave={() => this.handleSave()}>
                <FormFields formData={formData} formMetadata={this.formMetadata} handleChange={(formField, value) => this.handleChange(formField, value)} />
              </ModalForm>
            );
    }

    renderNotFound() {
        return (<div className="modal-body">
                   That template could not be found
                </div>);
    }

};

TemplateDisplay.propTypes = {
    formMetadata: ImmutablePropTypes.iterable,
    router: React.PropTypes.object.isRequired
};

function mapDispatch(dispatch) {
  return bindActionCreators({acAddTemplate, acUpdateTemplate, acStoreTemplateForm, acUpdateSelectedTemplate}, dispatch);
}

export default exposeRouter(connect(getPrintingTemplatesMutable, mapDispatch)(TemplateDisplay));
