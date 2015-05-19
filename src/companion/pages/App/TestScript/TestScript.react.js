import React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import {Map, List} from 'immutable';
import {getFacilityContext} from 'data/csapi';

import {IBox, IBoxBody} from 'components/common/IBox';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Input} from 'react-bootstrap';
import {Button} from 'components/common/bootstrap';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';
import Dropzone from 'react-dropzone';

function defaultParamName(fileName) {
    if (fileName.indexOf("script") == 0) {
        return "script";
    } else {
        return fileName.split(".")[0];
    }
}



/*
var Dropzone = require("imports?this=>window!dropzone");
require("dropzone/dist/min/dropzone.min.css");
*/
export default class TestScript extends React.Component{

    constructor() {
        super();
        this.state = {loading: false,
                      response: null,
                      files: Map()};
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true,
                       response: "Waiting..."});

        let scriptFormData = this.state.files.reduce((formData, file) => {
            let name = file.name;
            let inputNode = React.findDOMNode(this.refs["paramName-" + name]).getElementsByTagName("input")[0];
            let paramName = inputNode.value;
            formData.append(paramName, file);
            return formData;
        }.bind(this), new FormData());
        var apiContext = getFacilityContext();
        apiContext.runPickScript(scriptFormData).then((response) =>{
            this.setState({loading: false,
                           response: response});
        }, (error) => {
            this.setState({loading: false,
                           response: error});
        });
    }

    handleDrop(files) {
        let newFilesMap = this.state.files.withMutations((filesMap)=> {
            _.forEach(files, (file) =>{
                filesMap.set(file.name, file);
            });
            return filesMap;
        });
        this.setState({files: newFilesMap});
    }

    componentDidMount() {

    }

    renderButtonLabel() {
        if(this.state.loading) {
            return <span><Icon name="spinner" spin/> Running...</span>;
        } else {
            return <span>Run</span>;
        }
    }

    render() {
        let {response, files} = this.state;
        return (<DocumentTitle title="Test Script">
                <PageGrid>
                    <Row>
                        <Col sm={12} md={6}>
                            <IBox>
                                <IBoxBody>
                                    <form ref="testscriptform" onSubmit={this.handleSubmit.bind(this)}>
                                        <Dropzone className="dropzone text-center" style={{width: "100%", padding: "1em", borderStyle: "dashed"}} onDrop={this.handleDrop.bind(this)}>

                                        {
                                            (files.count() > 0) ?
                                                <h3>Name Script Files or Upload More</h3>
                                                :
                                                <div>
                                                    <Icon name="upload" size="5x"/>
                                                    <h3>Click/Drop Test Script And Data Files</h3>
                                                </div>
                                        }
                                        </Dropzone>
                                        <div>
                                            {
                                                files.map((file) => {
                                                    let name = file.name;
                                                    let defaultValue = defaultParamName(name);
                                                    let paramName = "paramName-" + name;
                                                    return <Input key={paramName}
                                                                  ref={paramName}
                                                                  name={paramName}
                                                                  type="text"
                                                                  defaultValue={defaultValue}
                                                                  addonAfter={file.name}/>;
                                                }).toArray()

                                            }
                                        </div>
                                    <Button bsStyle="primary" type="submit">
                                    {
                                        this.renderButtonLabel()
                                    }

                                    </Button>
                                    {
                                        (response) ?
                                            <div>
                                                <h3>Response</h3>
                                                <pre>{response}</pre>
                                            </div>
                                            :
                                            null
                                    }
                                </form>
                            </IBoxBody>
                          </IBox>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
        );
    }
};
