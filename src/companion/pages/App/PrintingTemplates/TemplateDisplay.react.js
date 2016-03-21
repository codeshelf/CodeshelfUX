import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import {Modal, Button, Input, Row, Col} from 'react-bootstrap';
import Icon from 'react-fa';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import _ from 'lodash';

import Immutable, {fromJS, Record} from 'immutable';
import uuid from 'node-uuid';

// new imports redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Text from "data/types/Text";

import {getPrintingTemplatesMutable} from "./get";
import {acAddTemplate, acUpdateTemplate, acStoreTemplateForm, acUpdateSelectedTemplate,
    acChangeOrderId, acGetPdfPreview, NEWID, getPdf} from "./store";

var PDF = require('react-pdf');

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
            {name: "domainId", label: "Name", required: true},
            {name: "active", label: "Active", type: Boolean},
            {name: "template", label: "Template", type: Text, required: true}]
        this.state = {
            currentPage: 1,
            pages: 2,
        }
        this.handleOrderChange = (e) => this.props.acChangeOrderId(e.target.value)
    }

    componentWillMount() {
        this.findSelectedTemplateForm(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.findSelectedTemplateForm(newProps);
    }

    shouldComponentUpdate(newProps) {
        return !_.isEqual(this.props, newProps);
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
      console.info(formField, value, 'form and value');
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
      const {orderId, preview} = this.props;
      const previewUrl = preview ? 'https://test.codeshelf.com' + preview.substr(16): null;
      console.info(previewUrl);
      const pdfInitParams = {
        url: previewUrl,
        withCredentials: true
      };
      return (<ModalForm widerModal={true} title="Edit Template" formData={formData} returnRoute={toURL(this.props, "../templates")}
                onSave={() => this.handleSave()}>
                <Row>
                    <Col xs={6}>
                        <FormFields
                            formData={formData}
                            formMetadata={this.formMetadata}
                            handleChange={(formField, value) => this.handleChange(formField, value)} />
                          <Input
                            type="text"
                            value={orderId}
                            hasFeedback
                            ref="input"
                            groupClassName="group-class"
                            labelClassName="label-class"
                            onChange={this.handleOrderChange}
                            buttonAfter={
                                <Button bsStyle="primary" onClick={() => this.props.acGetPdfPreview(orderId, '')}><Icon name="search"/></Button>
                            } />
                    </Col>
                    <Col xs={6}>
                      { preview && <PDF scale={0.75} file={pdfInitParams}/>}
                    </Col>
                </Row>
              </ModalForm>
            );
    }

    _onDocumentComplete(pages) {
      this.setState({pages: pages});
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
  return bindActionCreators({acAddTemplate, acUpdateTemplate, acStoreTemplateForm, acUpdateSelectedTemplate, acChangeOrderId, acGetPdfPreview, getPdf}, dispatch);
}

export default exposeRouter(connect(getPrintingTemplatesMutable, mapDispatch)(TemplateDisplay));
