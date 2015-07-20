import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import {Input, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImportList from './ImportList';



const priorDayInterval = DayOfWeekFilter.priorDayInterval;

export default class Imports extends React.Component{

    constructor() {
        super();
        this.state = {loading: false,
                      interval: priorDayInterval(0),
                      receipts: []};
    }

    fetchImportReceipts() {
        let {start, end} = this.state.interval;
        getFacilityContext().getImportReceipts(start.toISOString(), end.toISOString()).then((receipts) => {
            this.setState({"receipts": receipts});
        });
    }

    getImportReceipts() {
        return this.state.receipts;
    }

    componentWillMount() {
        this.fetchImportReceipts();
    }

    handleChange(daysBack) {
        this.setState({interval: priorDayInterval(daysBack)},
                       () => {
                           this.fetchImportReceipts();
                       });

    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true});


        var formData = new FormData();
        var input = React.findDOMNode(this.refs.orderFileInput);
        formData.append("file", input.getElementsByTagName("input")[0].files[0]);
        getFacilityContext().importOrderFile(formData).then(() => {
            this.setState({loading: false});
        });
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
                <SingleCellIBox title="Import Orders">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <Input ref="orderFileInput" type='file' label='Order File' help='Order file to import' />
                        <Button bsStyle="primary" type="submit">Import</Button>
                    </form>
                </SingleCellIBox>
                <SingleCellIBox title="Order Files Imported">
            {/**
                            <form>

                                <Button type="submit" onClick={this.handleClick.bind(this)}>
                                    {
                                        this.renderButtonLabel()
                                    }

                                </Button>

                            </form>
              **/}
                <IBoxSection>
                    <DayOfWeekFilter numDays={4} onChange={this.handleChange.bind(this)} />
                </IBoxSection>
                <IBoxSection>
                    <ImportList receipts={receipts} />
                </IBoxSection>



                  </SingleCellIBox>
                </SingleCellLayout>
        );
    }
};
