import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import {Modal, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";
import _ from 'lodash';

import {selectedWorkerCursor, workersCursor} from 'data/state';

import Immutable, {fromJS} from 'immutable';
import uuid from 'node-uuid';
import {NEWID, Worker} from 'data/workers/store.js';
import {addWorker, updateWorker} from 'data/workers/actions';

// new imports redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getWorkerMgmtMutable} from "./get";
import {acAddWorker, acUpdateWorker, acStoreSelectedWorkerForm,
        acUpdateSelectedWorker, acUnsetError} from "./store";

class WorkerDisplay extends Component {

    constructor() {
        super();
        this.formMetadata = [
            {name: "firstName", label: "First"},
            {name: "middleInitial", label: "Middle Initial"},
            {name: "lastName", label: "Last", required: true},
            {name: "domainId", label: "Badge ID", required: true,
                    addOnAfter: this.renderBarcodeGeneratorComponent("domainId")},
            {name: "hrId", label: "HR ID"},
            {name: "groupName", label: "Group"},
            {name: "active", label: "Active", type: Boolean}];
    }
    componentWillMount() {
        this.findSelectedWorkerForm(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.findSelectedWorkerForm(newProps);
    }

    findSelectedWorkerForm(props) {
        let path = props.location.pathname;
        let workerId = null;
        if (path.indexOf("new") >= 0) {
            workerId = "new";
        } else {
            workerId = props.params.workerId;
        }

        let workerForm = this.props.itemForm;
        if (!workerForm || workerForm.get('persistentId') !== workerId) {
            if (workerId === "new") {
                workerForm = Worker();
                this.props.acStoreSelectedWorkerForm(workerForm);
            } else {
                workerForm = this.props.items.get('data').find((worker) => worker.persistentId === workerId);
                this.props.acStoreSelectedWorkerForm(fromJS(workerForm));
            }
        }
    }

    getLabel(key) {
        return this.props.formMetadata
            .find((f)=> f.get("columnName") == key)
            .get("displayName", "");
    }

    // getSelectedWorkerForm() {
    //     return selectedWorkerCursor();
    // }

    handleChange(formField, value) {
      this.props.acUpdateSelectedWorker(formField.name, value);
    }

    handleSave() {
        const selectedWorkerForm = this.props.itemForm;
        const id = selectedWorkerForm.persistentId;
        let promise;
        if (id === NEWID) {
            promise = this.props.acAddWorker(selectedWorkerForm.set("persistentId", null));
            this.props.acStoreSelectedWorkerForm(Worker());
        } else {
            promise = this.props.acUpdateWorker(selectedWorkerForm);
        }
        return promise;
    }


    render() {
      const formData = this.props.itemForm;
      const error = this.props.addItem.get('error') ?
                    this.props.addItem.get('error') :
                    this.props.updateItem.get('error');

      return (<ModalForm title="Edit Worker"
                         formData={formData}
                         returnRoute={toURL(this.props, "../workers")}
                         onSave={() => this.handleSave()}
                         actionError={error}
                         acUnsetError={this.props.acUnsetError}>
                <FormFields formData={formData}
                            formMetadata={this.formMetadata}
                            handleChange={(formField, value) => this.handleChange(formField, value)} />
              </ModalForm>
            );
    }

    renderNotFound() {
        return (<div className="modal-body">
                   That worker could not be found
                </div>);
    }

    renderBarcodeGeneratorComponent (name) {
        function setBadgeId() {
            const barCode = this.generateBarcode();
            const selectedWorkerForm = this.props.itemForm;
            this.props.acStoreSelectedWorkerForm(selectedWorkerForm.set(name, barCode));
        };

        return <Button id="generateBadgeId" bsStyle="link" onClick={setBadgeId.bind(this)}><Icon name="barcode" size="2x" /></Button>;
    }

    generateBarcode() {
        const length = 12;
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const code = _.sample(chars, length).join('');
        return code;
    }
};

WorkerDisplay.propTypes = {
    formMetadata: ImmutablePropTypes.iterable,
    router: React.PropTypes.object.isRequired
};

function mapDispatch(dispatch) {
  return bindActionCreators({acAddWorker, acUpdateWorker, acStoreSelectedWorkerForm,
                            acUpdateSelectedWorker, acUnsetError}, dispatch);
}

export default exposeRouter(connect(getWorkerMgmtMutable, mapDispatch)(WorkerDisplay));
