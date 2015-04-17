import  React from 'react';
import exposeRouter from 'components/common/exposerouter';

import DocumentTitle from 'react-document-title';
import {Modal, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {selectedWorkerCursor, workersCursor} from 'data/state';

import Immutable from 'immutable';
import uuid from 'node-uuid';
import {NEWID, Worker} from 'data/workers/store.js';
import {addWorker, updateWorker} from 'data/workers/actions';

class WorkerDisplay extends React.Component {

    constructor() {
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
        var workerId = props.router.getCurrentParams().workerId;
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

    handleSave(e) {
        e.preventDefault();
        console.log("pretending to save remotely asynchronously");

        var selectedWorkerForm = this.getSelectedWorkerForm();
        var id = selectedWorkerForm.get("persistentId");
        var promise;
        if (id === NEWID) {
            promise = addWorker(selectedWorkerForm.set("persistentId", null));
        } else {
            promise = updateWorker(selectedWorkerForm);
        }
        this.setState({"savePending": true});
        promise.then(() => {
            this.handleClose();
        });
    }


    handleClose() {
        this.setState({"savePending": false});
        this.storeSelectedWorkerForm(null);
        let params = this.props.router.getCurrentParams();
        this.props.router.transitionTo("workermgmt", params);
    }

    render() {
        var formData = this.getSelectedWorkerForm();
        var title = formData ? "Edit Worker" : "Not Found"
;        return (
                <Modal bsStyle='primary' className="panel-heading" title={title} onRequestHide={this.handleClose.bind(this)}>
                    { formData ? this.renderForm(formData) : this.renderNotFound()}
                </Modal>
            );
    }

    renderNotFound() {
        return (<div className="modal-body">
                   That worker could not be found
                </div>);
    }

    renderForm(formData) {
        return (                <form onSubmit={this.handleSave.bind(this)}>
                                <div className='modal-body'>
                                {
                                    ["firstName", "middleInitial", "lastName",  "badgeId", "hrId", "groupName"].map((objField, i) =>{

                                        var value= formData.get(objField);
                                        var label= this.getLabel(objField);
                                        return this.renderCustomInput(objField, i, label, value) || this.renderTextInput(objField, i, label, value);

                                    })
               }
        </div>
            <div className='modal-footer'>
            <Button onClick={this.handleClose.bind(this)}>Cancel</Button>

            <Button bsStyle="primary" type="submit">{
                this.renderSaveButtonContent()
            }</Button>
            </div>
            </form>
);
    }



    renderTextInput(objField, index, label, value) {
        return <Input key={objField} ref={objField}
                type="text"
                autoFocus={index == 0}
                disabled={this.state.savePending}
                name={objField}
                label={label}
                value={value}
                onChange={this.handleChange.bind(this, objField)}
                />;
    }

    renderCustomInput(objField, index, label, value) {
        if (objField === "badgeId") {
            return <Input key={objField} ref={objField}
                    type="text"

                    autoFocus={index == 0}
                    disabled={this.state.savePending}
                    name={objField}
                    label={label}
                    value={value}
                    onChange={this.handleChange.bind(this, objField)}
                    buttonAfter={this.renderBarcodeGeneratorComponent(objField, value)}
                    />;
        }
        else {
            return null;
        }
    }

    renderSaveButtonContent() {
        if (this.state.savePending) {
            return (<span><Icon name="spinner" spin/> Saving...</span>);
        }
        else {
            return "Save";
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

        return <Button bsStyle="primary" disabled={(value) ? true : false} onClick={setBadgeId.bind(this)}><Icon name="barcode" /></Button>;
    }

    generateBarcode() {
        var length = 12;
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        var code = "U%" + _.sample(chars, length).join('');
        return code;
    }
};

WorkerDisplay.propTypes = {
    formMetadata: React.PropTypes.array,
    router: React.PropTypes.func
};

export default exposeRouter(WorkerDisplay);
