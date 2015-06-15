import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import {Input, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import ImportList from './ImportList';



const priorDayStart = DayOfWeekFilter.priorDayStart;
const priorDayEnd = DayOfWeekFilter.priorDayEnd;


export default class Imports extends React.Component{

    constructor() {
        super();
        this.state = {loading: false,
                      "startTimestamp" : priorDayStart(0),
                      "endTimestamp" : priorDayEnd(0),
                      receipts: []};
    }

    fetchImportReceipts() {
        let {startTimestamp, endTimestamp} = this.state;
        getFacilityContext().getImportReceipts(startTimestamp, endTimestamp).then((receipts) => {
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
        this.setState({startTimestamp: priorDayStart(daysBack),
                       endTimestamp: priorDayEnd(daysBack)},
                       () => {
                           this.fetchImportReceipts();
                       });

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
