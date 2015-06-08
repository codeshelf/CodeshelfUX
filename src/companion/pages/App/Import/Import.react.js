import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from 'components/common/IBox';

import {Input, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImportList from './ImportList';




export default class Imports extends React.Component{

    constructor() {
        super();
        this.state = {loading: false,
                      receipts: []};
    }

    subscribe() {
        getFacilityContext().getImportReceipts().then((receipts) => {
            this.setState({"receipts": receipts});
        });
    }

    unsubscribe() {}

    getImportReceipts() {
        return this.state.receipts;
    }

    componentWillMount() {
        this.subscribe("imports", this.getImportReceipts);
    }

    componentWillUnmount() {
        this.unsubscribe("imports");
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
        let receipts = this.getImportReceipts();
        return (<SingleCellLayout title="Manage Imports">
                   <SingleCellIBox title="Order Files Imported">
            {/**
                            <form>
                                <Input type='file' label='Order File' help='Order file to import' />
                                <Button type="submit" onClick={this.handleClick.bind(this)}>
                                    {
                                        this.renderButtonLabel()
                                    }

                                </Button>

                            </form>
              **/}
                  <ImportList receipts={receipts} />
                  </SingleCellIBox>
                </SingleCellLayout>
        );
    }
};
