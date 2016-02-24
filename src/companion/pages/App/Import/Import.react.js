import React from 'react';
import {Link} from '../../links.js';
import {Tabs, Tab} from 'react-bootstrap';
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import UploadForm from 'components/common/UploadForm';

import {Authz, authz, isAuthorized} from 'components/common/auth';
import {getFacilityContext} from 'data/csapi';
import ImportList from './ImportList';
import ImportSearch from './ImportSearch';
import search from "data/search";
import Promise from "bluebird";
export default class Imports extends React.Component{

    constructor() {
        super();
        this.state = {
            refreshingAction: Promise.resolve([]),
            receipts: []
        };
    }

    handleRefresh() {
        var promise = this.state.refreshingAction;

        if (promise && promise.isPending()) {
            console.log("refresh already happening, cancellable: ", promise.isCancellable());
            return promise;
        } else {
            return this.handleFilterChange(this.refs.search.getFilter());
        }

    }

    handleFilterChange(filter) {
        let columns = this.columnsCursor;
        let properties = []; //based on columns

        var promise = this.state.refreshingAction;

        if (promise && promise.isPending()) {
            if (promise.isCancellable() == false) {
                console.error("unable to cancel existing search");
            } else {
                console.log("cancelling order search");
                promise.cancel();
            }
        }
        promise =  getFacilityContext().findImportReceipts(filter).then((receipts) => {
            this.handleResultsUpdated(receipts, receipts.length);
        });
        promise.then(()=> this.forceUpdate());
        this.setState({"refreshingAction" : promise});
        return promise;
    }

    handleResultsUpdated(receipts, total) {
        this.setState({"receipts": receipts});
    }

    getImportReceipts() {
        return this.state.receipts;
    }

    componentDidMount() {
        window.requestAnimationFrame(function () {
            this.handleRefresh();
        }.bind(this));
    }

    handleImportSubmit(method, file) {
        var formData = new FormData();
        formData.append("file", file);
         return getFacilityContext()[method](formData).then(function() {
            this.handleRefresh();
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
                        <ImportSearch ref="search" onFilterChange={this.handleFilterChange.bind(this)}/>
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
