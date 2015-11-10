import  React from "react";
import Icon from 'react-fa';
import _ from "lodash";
import DocumentTitle from "react-document-title";
import ListManagement from "components/common/list/ListManagement";
import {properties, keyColumn} from "data/types/ScheduledJob";
import {getFacilityContext} from "data/csapi";
import exposeRouter from 'components/common/exposerouter';
import {RouteHandler} from "react-router";
import {Button} from 'react-bootstrap';


function editRouteFactory(row) {
    return {
        to: "scheduledjobedit",
        params: {type: row.get("type")}
    };
}


function createRowActionComponent(onActionComplete) {
    class ScheduledJobActions extends React.Component {

        trigger(type) {
            return getFacilityContext().triggerSchedule(type).then(() => {
                onActionComplete();
            });
        }

        cancel(type) {
            return getFacilityContext().cancelJob(type).then(() => {
                onActionComplete();
            });
        }

        render() {
            var row  = this.props.rowData;
            let type = row.get("type");
            var C = ListManagement.toEditButton(editRouteFactory);
            return (
                <div>
                    <C rowData={row} />
                    <Button bsStyle="primary" style={{marginLeft: "1em"}} onClick={this.trigger.bind(this, type)}><Icon name="bolt"/></Button>
                    <Button bsStyle="primary" style={{marginLeft: "1em"}} onClick={this.cancel.bind(this, type)}><Icon name="hand-stop-o"/></Button>
                </div>);
        }

    }
    return ScheduledJobActions;
}
class ScheduledJobs extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            scheduledJobs: []
        };
        this.rowActionComponent = createRowActionComponent(this.handleActionComplete.bind(this));
    }

    findSchedule(props) {
        let selectedScheduleType = this.props.router.getCurrentParams().type;
        if (selectedScheduleType) {
            let {scheduledJobs} = this.state;
            this.setState({"scheduledJob": _.find(scheduledJobs, {type: selectedScheduleType})});
        }
    }

    handleActionComplete() {
        getFacilityContext().getScheduledJobs().then((jobs) => {
            this.setState({"scheduledJobs": jobs});
        });
    }

    componentWillMount() {
        this.handleActionComplete();
        this.findSchedule(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.findSchedule(nextProps);
    }

    render() {
        let columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
        let keyColumn = keyColumn;
        let {scheduledJobs = [], scheduledJob} = this.state;


        return (<DocumentTitle title="ScheduledJobs">
                    <div>
                        <ListManagement results={scheduledJobs}
                                    keyColumn={keyColumn}
                                    columnMetadata={columnMetadata}
                                    rowActionComponent={this.rowActionComponent}/>
                        {(scheduledJob) ?
                            <RouteHandler scheduledJob={scheduledJob} onUpdate={this.handleActionComplete.bind(this)} returnRoute="maintenance"/> : null}
                    </div>
                </DocumentTitle>
               );
    }
};
export default exposeRouter(ScheduledJobs);
