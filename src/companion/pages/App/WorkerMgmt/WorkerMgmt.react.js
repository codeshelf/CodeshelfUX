import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {PageGrid, Row, Col} from 'components/common/pagelayout';

import Griddle from 'griddle-react';
import {selectedWorkerCursor, workersCursor} from 'data/state';
import {Modal, Button, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';

export default class WorkerMgmt extends React.Component{

    constructor() {
        //TODO local state hack
        this.state = {
            "savePending" : false
        };

        this.columnMetadata = [
            {
                columnName: "lastName",
                displayName: "Last"
            },
            {
                columnName: "firstName",
                displayName: "First"
            },
            {
                columnName: "middleInitial",
                displayName: "M"
            },
            {
                columnName: "badgeId",
                displayName: "Badge"
            },
            {
                columnName: "workerId",
                displayName: "HR ID"
            },
            {
                columnName: "groupId",
                displayName: "Group"
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Edit
            }


        ];
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }

    getLabel(key) {
        return _.result(_.find(this.columnMetadata, "columnName", key), "displayName", "");
    }

    getSelectedWorkerForm() {
        return selectedWorkerCursor();
    }

    storeSelectedWorkerForm(workerForm) {
        selectedWorkerCursor((worker) => workerForm);
    }

    getWorkers() {
        return workersCursor().toJS();
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
            this.storeSelectedWorkerForm(null);
            this.setState({"savePending": null});

        }, 3000);
        this.setState({"savePending": token});
    }

    handleClose() {
        var token = this.state.savePending;
        if (token) {
            clearTimeout(token);
        }
        this.setState({"savePending": null});
        this.storeSelectedWorkerForm(null);
    }

    render() {
        var selectedWorker = this.getSelectedWorkerForm();
        var rows = this.getWorkers();
        return (<DocumentTitle title="Worker Management">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <Griddle results={rows}
                                     showFilter={true}
                                     columns={this.columns}
                                     columnMetadata={this.columnMetadata}
                                     showSettings={true}>
                            </Griddle>
                            {selectedWorker ? this.renderSelectedWorkerDialog(selectedWorker) : null}
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }

    renderSaveButtonContent() {
        if (this.state.savePending) {
            return (<span><Icon name="spinner" spin/> Saving...</span>);
        }
        else {
            return "Save";
        }
    }

    renderSelectedWorkerDialog(formData) {
        return (
                <Modal bsStyle='primary' className="panel-heading" title='Modal heading' onRequestHide={this.handleClose.bind(this)}>
                    <form onSubmit={this.handleSave.bind(this)}>
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
                </Modal>
                );
    }


    renderTextInput(formData, objField, index) {
        return <Input type="text"
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
            return <Input type="text"
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

class Edit extends React.Component {
    handleClick(rowData, e) {
        selectedWorkerCursor((oldWorker) => {
            var o = {};
            _.forIn(rowData, (value, key) => o[key] = value);
            return new Immutable.Map(o);
        });
    }

    render() {

        var formData = this.props.rowData;
        return (<Button bsStyle="primary" onClick={this.handleClick.bind(this, formData)}><Icon name="edit" /></Button>);
    }

}
