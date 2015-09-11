import {getFacilityContext} from 'data/csapi';
import React from 'react';
import {Link} from 'react-router';
import {Tabs, Tab} from 'react-bootstrap';
import {SingleCellLayout} from 'components/common/pagelayout';
import {Form, SubmitButton, SuccessDisplay, ErrorDisplay, Input} from 'components/common/Form';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';
import ImportList from './ImportList';
import {Authz, authz, isAuthorized} from 'components/common/auth';

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


class UploadForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {errorMessage: null};
    }

    handleSubmit(e) {
        e.preventDefault();
        var input = React.findDOMNode(this.refs.fileInput);
        let file = input.getElementsByTagName("input")[0].files[0];
        this.setState({errorMessage: null});
        this.setState({successMessage: null});
        return this.props.onImportSubmit(file).then(((data) => {
                this.setState({errorMessage: null});
            this.setState({successMessage: "File Imported"});
            return data;
        }), (e) => {
                this.setState({errorMessage: e.message});
                this.setState({successMessage: null});
            return e;
        });
    }

    render() {
        let {eventKey, label, onImportSubmit} = this.props;
        let {successMessage, errorMessage} = this.state;
        return (<SingleCellIBox title={label + " Import"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
                 <SuccessDisplay message={successMessage} />
                 <ErrorDisplay message={errorMessage} />
                                <Input ref="fileInput"
                                       type='file'
                                           label={label + " File"}
                                       help={label + " files to import"}
                                       required={true} />
                                <SubmitButton label="Import" />
                            </Form>
            </SingleCellIBox>);
        }
};
