import DocumentTitle from 'react-document-title';
import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {SingleCellLayout} from 'components/common/pagelayout';
import {Input, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImportList from './ImportList';

import formatTimestamp from 'lib/timeformat';

export default class WorkResults extends React.Component{

    constructor() {
        super();
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

        let imports = [{
            fileName: "orders-2015-03-02.csv",
            source: "dropbox",
            imported: formatTimestamp(new Date())
        }];
        return (<SingleCellLayout title="Work Results">
                            <form>
                                <Input type='file' label='Order File' help='Order file to import' />
                                <Button type="submit" onClick={this.handleClick.bind(this)}>
                                    {
                                        this.renderButtonLabel()
                                    }

                                </Button>

                            </form>
                            <ImportList imports={imports} />
                </SingleCellLayout>
        );
    }
};
