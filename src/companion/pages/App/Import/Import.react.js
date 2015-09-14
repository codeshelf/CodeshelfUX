import React from 'react';
import {Link} from 'react-router';
import {Tabs, Tab} from 'react-bootstrap';
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import UploadForm from 'components/common/UploadForm';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';
import {Authz, authz, isAuthorized} from 'components/common/auth';
import {getFacilityContext} from 'data/csapi';
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

    handleImportSubmit(method, file) {
        var formData = new FormData();
        formData.append("file", file);
         return getFacilityContext()[method](formData).then(() => {
            this.fetchImportReceipts();
        }.bind(this));
    }

    renderOrder() {
        let receipts = this.getImportReceipts();
        return (
                <Tab eventKey="orders" title="Orders">
                    <Authz permission="order:import">
                        <UploadForm
                            label="Orders"
                            onImportSubmit={this.handleImportSubmit.bind(this, "importOrderFile")} />
                    </Authz>

                    <SingleCellIBox title="Order Files Imported">
                        <IBoxSection>
                            <DayOfWeekFilter numDays={4} onChange={this.handleChange.bind(this)} />
                        </IBoxSection>
                        <IBoxSection>
                        {/**  passing state through is a hack until we can have something like sub cursors**/}
                            <ImportList receipts={receipts} state={this.props.state}/>
                        </IBoxSection>
                    </SingleCellIBox>
                </Tab>
        );
    }

    renderLocation() {
        return (
            <Tab eventKey="locations" title="Locations" >
                <UploadForm
                    label="Locations"
                    onImportSubmit={this.handleImportSubmit.bind(this, "importLocationFile")} />
            </Tab>
        );
    }

    renderAisle() {
        return (
            <Tab eventKey="aisles" title="Aisles">
                <UploadForm
                    label="Aisles"
                    onImportSubmit={this.handleImportSubmit.bind(this, "importAislesFile")} />
            </Tab>
        );
    }

    renderInventory() {
            return  (<Tab eventKey="inventory" title="Inventory">
                        <UploadForm
                                label="Inventory"
                                onImportSubmit={this.handleImportSubmit.bind(this, "importInventoryFile")} />
                     </Tab>);
    }

    render() {

            return (<SingleCellLayout title="Manage Imports">
                <Authz permission="facility:edit">
                    <Link id="configure" to="edigateways" params={{facilityName: getFacilityContext().domainId}}>Configure EDI</Link>
                </Authz>
                <Tabs className="nav-tabs-simple" defaultActiveKey="orders">
                    {this.renderOrder()}
                    {isAuthorized("location:import") && this.renderLocation()}
                    {isAuthorized("location:import") && this.renderAisle()}
                    {isAuthorized("inventory:import") && this.renderInventory()}
                </Tabs>

                </SingleCellLayout>
        );
    }
};
