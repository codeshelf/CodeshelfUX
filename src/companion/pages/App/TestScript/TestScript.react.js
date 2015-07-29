import React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getFacilityContext} from 'data/csapi';

import {IBox, IBoxBody} from 'components/common/IBox';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Input, ListGroup, Modal} from 'react-bootstrap';
import {Button, List as BSList} from 'components/common/bootstrap';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';

class Confirm extends React.Component {


    render() {
        let {onClick, actionLabel} = this.props;
        return (<Modal {...this.props}>
                    <Modal.Header><h5>{this.props.title}</h5></Modal.Header>
                    <Modal.Body>{this.props.children}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={onClick}>{actionLabel}</Button>
                        <Button bsStyle="primary" onClick={this.props.onHide}>Cancel</Button></Modal.Footer>
                </Modal>);
    }
}

export default class TestScript extends React.Component{

    constructor() {
        super();
        this.state = {scriptInputs: Map(),
                      confirmDelete: false,
                      deleteFailure: ""
                     };
        this.deleteOrders = this.deleteOrders.bind(this);
        this.closeConfirm = this.closeConfirm.bind(this);
    }

    handleScriptInputChanges(scriptInputs) {
        this.setState({"scriptInputs": scriptInputs});
    }

    closeConfirm() {
        this.setState({confirmDelete: false,
                       deleteFailure: ""});
    }

    deleteOrders() {
        this.setState({deleting: true});
        getFacilityContext().deleteOrders().then(() => {
            this.closeConfirm();
        }.bind(this), (e) => {
            this.setState({deleteFailure: "Deletion Failed: " + e});
        }.bind(this))
        .finally(() =>{
            this.setState({deleting: false});
        });

    }

    render() {
            let {scriptInputs, deleteFailure, deleting, confirmDelete} = this.state;
            return (<DocumentTitle title="Test Script">
                        <PageGrid>
                            <Row>
                                <Col sm={12} md={6}>
                                        <Confirm show={confirmDelete}
                                            title="Delete All Orders"
                                            actionLabel={
                                                (deleting)
                                                    ? <span>Deleting <Icon name="spinner" /></span>
                                                    : "Delete"
                                            }
                                            onClick={this.deleteOrders}
                                            onHide={this.closeConfirm}>
                                                {

                                                    (deleteFailure) ?
                                                        <div className="alert alert-danger">
                                                            {deleteFailure}
                                                        </div> : null
                                                }
                                                Are you sure you want to delete all order information for this facility?
                                            </Confirm>

                <IBox>
                    <IBoxBody>
                        <Button className="pull-right" type="button" bsStyle="primary" onClick={() => {
                                this.setState({"confirmDelete": true});
                        }}>
                            Delete Orders
                            </Button>
                        <ScriptInput onChange={this.handleScriptInputChanges.bind(this)} />
                        <ScriptStepExecutor scriptInputs={scriptInputs} />
                </IBoxBody>
                </IBox>
                </Col>
                </Row>
                </PageGrid>
                </DocumentTitle>
               );
    }
};


class ScriptStepExecutor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stepResponse: null
        };
    }

    processScript(scriptInputs) {
        this.setState({"loading": true});
        let scriptFormData = this.toFormData(scriptInputs.files);
        var apiContext = getFacilityContext();
        return this.processResponse(apiContext.processPickScript(scriptFormData));
    }

    processStep(scriptInputs, stepResponse) {
        this.setState({"loading": true});
        let {requiredFiles} = stepResponse;
        let allFiles = scriptInputs.files;
        let filteredFiles = Map(allFiles).filter((file) =>  {
            return _.contains(requiredFiles, file.paramName);
        });

        if (filteredFiles.count() != requiredFiles.length) {
            console.warn("expected ", requiredFiles);
        }

        let scriptFormData = this.toFormData(filteredFiles);
        var apiContext = getFacilityContext();
        return this.processResponse(apiContext.runScriptStep(scriptFormData, stepResponse.id, scriptInputs.timeout));
    }

    toFormData(files) {
        return Map(files).reduce((formData, file, fileName) => {
            formData.append(file.paramName, file.file);
            return formData;
        }, new FormData());
    }

    processResponse(promise) {
        return promise.then((stepResponse) =>{
            this.setState({loading: false,
                           stepResponse: stepResponse});
        }, (error) => {
            let stepResponse = error.body;
            this.setState({loading: false,
                           stepResponse: stepResponse});
        });
    }

    renderButton(action, loading) {
        return  (<Button bsStyle="primary" type="submit" onClick={action}>
                {
                    (loading) ?
                        <span><Icon name="spinner" spin/> Running...</span>
                        :
                        <span>Run</span>
                }
                </Button>);

    }

    renderFirstStep(scriptInputs) {
        return (
                <div className="text-right">
                    {
                        this.renderButton(this.processScript.bind(this, scriptInputs), false)
                    }
                </div>
                );
    }

    renderNextStep(scriptInputs, stepResponse) {
        //{"id":"05b0356f-38e6-4185-a21e-989136bae79b","requiredFiles":["aisles","locations"],"report":"Script imported"}
        let {comment, requiredFiles} = stepResponse;
        let title = comment || "Next Step";

        let {loading} = this.state;

        return (<div>
                    {
                        (stepResponse.id) ?

                                <div>
                                    <h4>{title}</h4>
                                    <BSList label="Required Files" values={requiredFiles} />
                                    <div className="text-right">
                                    {
                                        this.renderButton(this.processStep.bind(this, scriptInputs, stepResponse), loading)
                                    }
                                    </div>
                                 </div>
                            :
                            <span> Done </span>
                    }
                    <div>
                        <h3>Last Response</h3>
                        <BSList label="Errors:" values={(stepResponse.errors)} />
                        <pre>{stepResponse.report}</pre>
                    </div>
                </div>);
    }

    validScriptInputs(scriptInputs) {
        return _.keys(scriptInputs.files).length > 0;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.validScriptInputs(nextProps.scriptInputs)) {
            this.setState({stepResponse: null});
        }
    }

    render() {
        let {scriptInputs} = this.props;
        let {stepResponse} = this.state;
        let valid = this.validScriptInputs(scriptInputs);
        if (valid && !stepResponse) {
            return this.renderFirstStep(scriptInputs);
        } else if (valid && stepResponse) {
            return this.renderNextStep(scriptInputs, stepResponse);
        } else {
            return null;
        }
    }
}

function defaultParamName(fileName) {
    if (fileName.indexOf("script") == 0) {
        return "script";
    } else {
        let droppedExtension = fileName.substring(0, fileName.lastIndexOf("."));
        return droppedExtension;
    }
}



class ScriptInput extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            files: Map(),
            timeout: 5
        };
    }

    setState(object) {
        super.setState(object, () => {
            this.props.onChange({
                    files: this.state.files.toJS(),
                    timeout: this.state.timeout
            });
        });
    }

    handleParamNameChange(fileToChange, e) {
        this.setState({
            "files": this.state.files.updateIn(
                [fileToChange.fileName, "paramName"], e.target.value)
        });
    }

    handleDrop(files) {
        let keyedFiles = List(files).reduce((keyedFiles, file) => {
            return keyedFiles.set(file.name, Map({
                    paramName: defaultParamName(file.name),
                    fileName: file.name,
                    file: file
            }));
        }, Map());
        this.setState({"files": this.state.files.merge(keyedFiles)});
    }

    handleClear() {
        let fileInput = React.findDOMNode(this).querySelector("input[type=\"file\"]");
        fileInput.value = null;
        this.setState({"files" : Map()});
    }

    changeState(name, e) {
        var newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
    }

    render() {
        let {files} = this.state;
        return (<form>
                <Dropzone className="dropzone text-center" style={{width: "100%", padding: "1em", borderStyle: "dashed"}} onDrop={this.handleDrop.bind(this)}>
                    <Icon name="upload" size="4x"/>
                    <h3>Click/Drop Test Script And Data Files</h3>
                </Dropzone>
                {
                    (files.count() > 0) ?
                        <div>
                            <div className="text-right">
                                <Button bsStyle="primary" onClick={this.handleClear.bind(this)}>Clear</Button>
                            </div>
                            <Input label="timeout" onChange={this.changeState.bind(this, "timeout")} type="number" value={this.state.timeout} addonAfter="minutes" />
                        </div>
                        :
                        null
                }

                {
                    files.map((file) => {
                        let fileName = file.get("fileName");
                        let paramName = file.get("paramName");
                        return <Input
                                key={fileName}
                                ref={fileName}
                                name={fileName}
                                type="text"
                                value={paramName}
                                onChange={this.handleParamNameChange.bind(this, file)}
                                addonAfter={fileName}/>;
                    }).toArray()
               }
               </form>
               );

    }
};
