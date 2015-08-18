import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Modal, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import exposeRouter from 'components/common/exposerouter';
import ModalForm from "components/common/ModalForm";
import FormFields from "components/common/FormFields";

import {selectedWorkerCursor, workersCursor} from 'data/state';

import Immutable from 'immutable';
import uuid from 'node-uuid';
import {NEWID, Worker} from 'data/workers/store.js';
import {addWorker, updateWorker} from 'data/workers/actions';

class WorkerDisplay extends React.Component {

    constructor() {
        super();
        //TODO local state hack
        this.state = {
            "savePending" : false
        };
        this.handleSave = this.handleSave.bind(this);
            this.handleClose = this.handleClose.bind(this);
        this.formMetadata = [
            {name: "firstName", label: "First"},
            {name: "middleInitial", label: "Middle Initial"},
            {name: "lastName", label: "Last", required: true},
            {name: "badgeId", label: "Badge ID", required: true,
                    addOnAfter: this.renderBarcodeGeneratorComponent("badgeId")},
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
        let path = props.router.getCurrentPath();
        var workerId = null;
        if (path.indexOf("new") >= 0) {
            workerId = "new";
        } else {
            workerId = props.router.getCurrentParams().workerId;
        }

        var workerForm = this.getSelectedWorkerForm();
        if (!workerForm || workerForm.get("persistentId") !== workerId) {
            if (workerId === "new") {
                workerForm = Worker();
                this.storeSelectedWorkerForm(workerForm);
            } else {
                workerForm = workersCursor().find((worker) => worker.get("persistentId") === workerId);
                this.storeSelectedWorkerForm(workerForm);
            }
        }
    }

    getLabel(key) {
        return this.props.formMetadata
            .find((f)=> f.get("columnName") == key)
            .get("displayName", "");
    }

    getSelectedWorkerForm() {
        return selectedWorkerCursor();
    }

    storeSelectedWorkerForm(workerForm) {
        selectedWorkerCursor((worker) => workerForm);
    }

    handleChange(formField, value) {
        selectedWorkerCursor((oldWorker) => {
            var newWorker =  oldWorker.set(formField.name, value);
            return newWorker;
        });
    }

    handleSave() {
        var selectedWorkerForm = this.getSelectedWorkerForm();
        var id = selectedWorkerForm.get("persistentId");
        var promise;
        if (id === NEWID) {
            promise = addWorker(selectedWorkerForm.set("persistentId", null));
        } else {
            promise = updateWorker(selectedWorkerForm);
        }
        return promise;
    }


    handleClose() {
        this.storeSelectedWorkerForm(null);
    }

    render() {
        var formData = this.getSelectedWorkerForm();
            return (<ModalForm title="Edit Worker" formData={formData} returnRoute="workermgmt"
                           onSave={this.handleSave}
                           onClose={this.handleClose}>
                    <FormFields formData={formData} formMetadata={this.formMetadata} handleChange={this.handleChange} />
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
            var barCode = this.generateBarcode();
            selectedWorkerCursor((oldWorker) => {
                var newWorker =  oldWorker.set(name,barCode);
                return newWorker;
            });
            this.refs[objField].getInputDOMNode().focus();

        };

        return <Button bsStyle="link" onClick={setBadgeId.bind(this)}><Icon name="barcode" size="2x" /></Button>;
    }

    generateBarcode() {
        var length = 12;
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        var code = _.sample(chars, length).join('');
        return code;
    }
};

WorkerDisplay.propTypes = {
    formMetadata: ImmutablePropTypes.iterable,
    router: React.PropTypes.func
};

export default exposeRouter(WorkerDisplay);
