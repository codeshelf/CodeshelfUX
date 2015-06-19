import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Modal, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import classnames from 'classnames';
import exposeRouter from 'components/common/exposerouter';
import {Input} from "components/common/Form";
import ModalForm from "components/common/ModalForm";

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
        return _.result(_.find(this.props.formMetadata, "columnName", key), "displayName", "");
    }

    getSelectedWorkerForm() {
        return selectedWorkerCursor();
    }

    storeSelectedWorkerForm(workerForm) {
        selectedWorkerCursor((worker) => workerForm);
    }

    handleChange(formField, e) {
        var value = e.target.value;
        selectedWorkerCursor((oldWorker) => {
            var newWorker =  oldWorker.set(formField, value);
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
                           onSave={this.handleSave.bind(this)}
                           onClose={this.handleClose.bind(this)}>
                   {this.renderForm(formData)}
                </ModalForm>
            );
    }

    renderNotFound() {
        return (<div className="modal-body">
                   That worker could not be found
                </div>);
    }

    renderForm(formData) {
        return (
                                <div>
                                {
                                    ["firstName", "middleInitial", "lastName",  "badgeId", "hrId", "groupName"].map((objField, i) =>{

                                        var value= formData.get(objField);
                                        var label= this.getLabel(objField);
                                        var required = ["badgeId", "lastName"].indexOf(objField) >= 0;
                                        return this.renderCustomInput(objField, i, label, value, required)
                                            || this.renderTextInput(objField, i, label, value, required);

                                    })
               }
        </div>);
    }



    renderTextInput(objField, index, label, value, required) {
        return (
                <Input key={objField} ref={objField}
                 type="text"
                 name={objField}
                 label={label}
                 value={value}
                 required={required}
                 disabled={this.state.savePending}
                 autoFocus={index == 0}
                 onChange={this.handleChange.bind(this, objField)}
                 />
        );
    }

    renderCustomInput(objField, index, label, value, required) {
        if (objField === "badgeId") {
            return (
                    <Input key={objField} ref={objField}
                           type="text"
                           required={required}
                           autoFocus={index == 0}
                           disabled={this.state.savePending}
                           name={objField}
                           label={label}
                           value={value}
                           onChange={this.handleChange.bind(this, objField)}
                           addOnAfter={this.renderBarcodeGeneratorComponent(objField, value)}
                    />
            );
        }
        else {
            return null;
        }
    }

    renderBarcodeGeneratorComponent (objField, value) {
        var setBadgeId = function() {
            var barCode = this.generateBarcode();
            selectedWorkerCursor((oldWorker) => {
                var newWorker =  oldWorker.set(objField,barCode);
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
    formMetadata: React.PropTypes.array,
    router: React.PropTypes.func
};

export default exposeRouter(WorkerDisplay);
