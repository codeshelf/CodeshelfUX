import React from 'react';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Tabs, Tab} from 'react-bootstrap';
import {SingleCellLayout, Grid, Row1} from 'components/common/pagelayout';
import {IBox} from 'pages/IBox';
import {SingleCellIBox, IBoxSection} from 'components/common/IBox';
import DataObjectPurge from "./DataObjectPurge";
import DataObjectNotificationThreshold from "./DataObjectNotificationThreshold";
import EdiNotificationThreshold from "./EdiNotificationThreshold";
import {getAPIContext} from 'data/csapi';
import ParameterSetConfiguration from "./ParameterSetConfiguration.react.js";
import DailyMetrics from "./DailyMetrics.react.js";
import ScheduledJobs from "./ScheduledJobs.react.js";
import Promise from "bluebird";
import {fromJS} from "immutable";


class MaintenaceTabContent extends React.Component {
    render() {
        const {title} = this.props;
        return (
          <Grid fluid>
            <Row1>
              <SingleCellIBox title={title}>
                {this.props.children}
              </SingleCellIBox>
            </Row1>
          </Grid>
        );
    }
}

class Maintenance extends React.Component{

    constructor() {
        super();
        this.state = {

        };
    }

    findExtensionPoint(props) {

        let selectedParameterType = this.props.params.parameterType;
        if (selectedParameterType) {
            let configuration = this.state[selectedParameterType];
            let extensionPoint = (configuration) ? configuration.extensionPoint : null;
            return extensionPoint;
        }
    }

    handleConfigurationUpdate(props) {
        let parameterSetTypes = ["ParameterEdiFreeSpaceHealthCheck", "ParameterSetDataPurge", "ParameterSetDataQuantityHealthCheck"];
        return Promise.reduce(parameterSetTypes, (configs, type) => {
            return getAPIContext().getHealthCheckConfiguration(type).then((config) => {
                configs[type] = config;
                return configs;
            });
        }, {}).then((finalConfigs) => {
            this.setState(finalConfigs);
        });
    }


    componentWillMount() {
        this.handleConfigurationUpdate(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleConfigurationUpdate(nextProps);
    }

    render() {
        let {state: appState} = this.props;
        let extensionPoint = this.findExtensionPoint(this.props);
        let {
             ParameterSetDataPurge,
             ParameterSetDataQuantityHealthCheck} = this.state;
        const returnRoute = toURL(this.props, "../../maintenance");
        return (
                <SingleCellLayout title="Maintenance">
                  <IBox>
                    <Tabs className="nav-tabs-simple" defaultActiveKey="database">
                        <Tab eventKey="database" title="Database">
                            <Grid fluid>
                                <Row1>
                                        <SingleCellIBox title="Data Quantity Health Check">
                                            <ParameterSetConfiguration
                                            {...this.props}
                                             parameterType="ParameterSetDataQuantityHealthCheck"
                                             configuration={ParameterSetDataQuantityHealthCheck}
                                             onUpdate={this.handleConfigurationUpdate.bind(this)}
                                             />
                                        </SingleCellIBox>
                                </Row1>
                                <Row1>
                                  <DataObjectPurge
                                            {...this.props}
                                            parameterType="ParameterSetDataPurge"
                                            configuration={ParameterSetDataPurge}
                                            onConfigurationUpdate={this.handleConfigurationUpdate.bind(this)}

                                         />
                                </Row1>
                            </Grid>
                        </Tab>
                        <Tab eventKey="edi" title="EDI">
                            <Grid fluid>
                                <Row1>
                                        <SingleCellIBox title="Edi Free Space Health Check">
                                            <ParameterSetConfiguration
                                                {...this.props}
                                                parameterType="ParameterEdiFreeSpaceHealthCheck"
                                                configuration={this.state.ParameterEdiFreeSpaceHealthCheck}
                                                onUpdate={this.handleConfigurationUpdate.bind(this)}
                                             />
                                            </SingleCellIBox>
                                </Row1>
                            </Grid>
                        </Tab>
                        <Tab eventKey="daily" title="Daily">
                            <MaintenaceTabContent title="Daily Metrics" >
                              <DailyMetrics {...this.props} appState={appState}/>
                            </MaintenaceTabContent>
                        </Tab>
                    </Tabs>
                    {this.props.children && React.cloneElement(this.props.children,
                      {extensionPoint:fromJS(extensionPoint),
                       onExtensionPointUpdate:this.handleConfigurationUpdate.bind(this),
                       returnRoute })}
                  </IBox>
                </SingleCellLayout>
               );
    }
};
Maintenance.propTypes = {
    router: React.PropTypes.object.isRequired
};
export default exposeRouter(Maintenance);
