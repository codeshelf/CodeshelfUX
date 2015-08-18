import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {Link} from 'react-router';
import {SingleCellLayout} from 'components/common/pagelayout';
import {Form, SubmitButton, Input} from 'components/common/Form';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';
import ImportList from './ImportList';

const priorDayInterval = DayOfWeekFilter.priorDayInterval;

export default class Imports extends React.Component{

    constructor() {
        super();
        this.state = {interval: priorDayInterval(0),
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
        var formData = new FormData();
        var input = React.findDOMNode(this.refs.orderFileInput);
        formData.append("file", input.getElementsByTagName("input")[0].files[0]);
        return getFacilityContext().importOrderFile(formData).then(() => {
            this.fetchImportReceipts();
        }.bind(this));
    }

    render() {
        let receipts = this.getImportReceipts();
            return (<SingleCellLayout title="Manage Imports">

        <Link to="edigateways" params={{facilityName: getFacilityContext().domainId}}>Configure EDI</Link>
                <SingleCellIBox title="Import Orders">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                            <Input ref="orderFileInput" type='file' label='Order File' help='Order file to import' required={true} />
                        <SubmitButton label="Import" />
                    </Form>
                </SingleCellIBox>
                <SingleCellIBox title="Order Files Imported">
                <IBoxSection>
                    <DayOfWeekFilter numDays={4} onChange={this.handleChange.bind(this)} />
                </IBoxSection>
                    <IBoxSection>
                            {/**  passing state through is a hack until we can have something like sub cursors**/}
                    <ImportList receipts={receipts} state={this.props.state}/>
                </IBoxSection>



                  </SingleCellIBox>
                </SingleCellLayout>
        );
    }
};
