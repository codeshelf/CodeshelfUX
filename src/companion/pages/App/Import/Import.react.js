import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {Input, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Table} from 'components/common/Table';

export default class WorkResults extends React.Component{

    constructor() {
        this.state = {loading: false,
                      documents: []};
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({loading: true});

        //var apiContext = getFacilityContext();
        setTimeout(() => {
            this.setState({loading: false,
                           documents:[
                               {name: "a",
                                totalLines: 5},
                               {name: "b",
                                totalLines: 6}

                           ]});
        },3000);
    }


    renderButtonLabel() {
        if(this.state.loading) {
            return <span><Icon name="spinner" spin/> Importing...</span>;
        } else {
            return <span>Import</span>;
        }

    }

    render() {

        return (<DocumentTitle title="Work Results">
                <PageGrid>
                    <Row>
                        <Col sm={12}>
                            <form>
                                <Input type='file' label='Order File' help='Order file to import' />
                                <Button type="submit" onClick={this.handleClick.bind(this)}>
                                    {
                                        this.renderButtonLabel()
                                    }

                                </Button>

                            </form>
                            <Table rows={this.state.documents}>

                            </Table>
                        </Col>
                    </Row>
                </PageGrid>
                </DocumentTitle>
        );
    }
};
