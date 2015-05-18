import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Input} from 'react-bootstrap';
import {Button} from 'components/common/bootstrap';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';

export default class TestScript extends React.Component{

    constructor() {
        super();
        this.state = {loading: false,
                      response: null};
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = React.findDOMNode(this.refs.testscriptform);

        this.setState({loading: true});


        var apiContext = getFacilityContext();
        apiContext.runPickScript(form).then((response) =>{
            this.setState({loading: false,
                           response: response});
        });

    }

    renderButtonLabel() {
        if(this.state.loading) {
            return <span><Icon name="spinner" spin/> Running...</span>;
        } else {
            return <span>Run</span>;
        }

    }

    handleScript(e) {
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (load) => {
            console.log("Read file", file, load);
        };
        fileReader.onerror = (error) => {
            console.log("Error reading file", file, error);
        };
        fileReader.onprogress = (progress) => {
            console.log("Progress", progress);
        };
        fileReader.readAsDataURL(file);
    }

    render() {
        let {response} = this.state;
        return (<DocumentTitle title="Test Script">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <form ref="testscriptform" onSubmit={this.handleSubmit.bind(this)}>
                                <Input type='file' name="script" label='Script File' help='Select script file' />
                                <Input type='file' name="orders1" label='Order File' help='Select order file' />
                                <Button bsStyle="primary" type="submit">
                                    {
                                        this.renderButtonLabel()
                                    }

                                </Button>
                            </form>
                            <div>
                                <div>Response: </div>
                            {
                                (response) ? <pre>{response}</pre> : null
                            }
                            </div>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
        );
    }
};
