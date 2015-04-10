import  React from 'react';
import exposeRouter from 'components/common/exposerouter';

import DocumentTitle from 'react-document-title';
import {Modal, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import {selectedWorkerCursor, workersCursor} from 'data/state';


class WorkerDisplay extends React.Component {

    constructor() {
        //TODO local state hack
        this.state = {
            "savePending" : false
        };

    }
    componentDidMount() {
        var workerId = this.props.router.getCurrentParams().workerId;
        var workerForm = workersCursor().find((worker) => worker.get("_id") === workerId);
    selectedWorkerCursor((oldWorkerForm) => workerForm);

    }
    componentWillReceiveProps() {
        var workerId = this.props.router.getCurrentParams().workerId;
        var workerForm = this.getSelectedWorkerForm();
        if (workerForm && workerForm.get("_id") !== workerId) {
            workerForm = workersCursor().find((worker) => worker.get("_id") === workerId);
            selectedWorkerCursor((oldWorkerForm) => workerForm);
        }
    }

    getLabel(key) {
        return _.result(_.find(this.props.formMetadata, "column Name", key), "displayName", "");
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
        var id = selectedWorkerForm.get("_id");
        var token = setTimeout(() => {

            workersCursor((workerList) => {
                var i = workerList.findIndex((worker) => worker.get("_id") === id);
                console.log("Saving ", selectedWorkerForm, " to ", i);
                return workerList.set(i, selectedWorkerForm);
            });
            console.log("clearing form");
            this.setState({"savePending": null});
            this.handleClose();
        }, 3000);
        this.setState({"savePending": token});
    }

    handleClose() {
        var token = this.state.savePending;
        if (token) {
            clearTimeout(token);
        }
        this.setState({"savePending": null});

        this.props.router.transitionTo("workermgmt");
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
                                    ["firstName", "middleInitial", "lastName",  "badgeId", "workerId", "groupId"].map((objField, i) =>{
                                        return this.renderCustomInput(formData, objField) || this.renderTextInput(formData, objField, i);

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



    renderTextInput(formData, objField, index) {
        return <Input key={objField} type="text"
                autoFocus={index == 0}
                disabled={this.state.savePending}
                name={objField}
                label={this.getLabel(objField)}
                value={formData.get(objField)}
                onChange={this.handleChange.bind(this, objField)}
                />;
    }

    renderCustomInput(formData, objField, index) {
        if (objField === "badgeId") {
            return <Input key={objField} type="text"
                    value={formData.get(objField)}
                    autoFocus={index == 0}
                    disabled={this.state.savePending}
                    name={objField}
                    label={this.getLabel(objField)}
                    onChange={this.handleChange.bind(this, objField)}
                    buttonAfter={this.renderBarcodeGeneratorComponent(this.generateBarcode.bind(this, this.handleChange.bind(this)), objField)}
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


    renderBarcodeGeneratorComponent (callback, objField) {
        var setBadgeId = function() {
            var barCode = this.generateBarcode();
            selectedWorkerCursor((oldWorker) => {
                var newWorker =  oldWorker.set(objField,barCode);
                return newWorker;
            });

        }

        return <Button bsStyle="primary" onClick={setBadgeId.bind(this)}><Icon name="barcode" /></Button>;
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
