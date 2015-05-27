import React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import {Map, List, fromJS} from 'immutable';
import {getFacilityContext} from 'data/csapi';

import {IBox, IBoxBody} from 'components/common/IBox';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Input} from 'react-bootstrap';
import {Button} from 'components/common/bootstrap';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';

export default class TestScript extends React.Component{

    constructor() {
        super();
        this.state = {scriptInputs: Map()

                      };
    }

    handleScriptInputChanges(scriptInputs) {
        this.setState({"scriptInputs": scriptInputs});
    }

    render() {
        let {scriptInputs} = this.state;
        return (<DocumentTitle title="Test Script">
                <PageGrid>
                <Row>
                <Col sm={12} md={6}>
                <IBox>
                <IBoxBody>
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
        return this.processResponse(apiContext.runScriptStep(scriptFormData, stepResponse.nextStepId, scriptInputs.timeout));
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
        }, (xhr) => {
            let stepResponse = xhr.responseJSON;
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
        //{"nextStepId":"05b0356f-38e6-4185-a21e-989136bae79b","requiredFiles":["aisles","locations"],"report":"Script imported"}
        let {nextStepComment, requiredFiles} = stepResponse;
        let title = nextStepComment || "Next Step";

        let {loading} = this.state;

        return (<div>
                    <div>
                        <h3>Response</h3>
                        <pre>{stepResponse.report}</pre>
                    </div>
                    {
                        (stepResponse.nextStepId) ?

                                <div>
                                    <h4>{title}</h4>
                                    <div>Required Files:</div>
                                    <ul>
                                        {
                                            _.map(requiredFiles, (fileName) => {
                                                return (<li>{fileName}</li>);
                                            })

                                        }
                                    </ul>
                                    <div className="text-right">
                                    {
                                        this.renderButton(this.processStep.bind(this, scriptInputs, stepResponse), loading)
                                    }
                                    </div>
                                 </div>
                            :
                            <span> Done </span>
                    }
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
                                <Button bsStyle="primary" onClick={this.setState.bind(this, {files: Map()})}>Clear</Button>
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
