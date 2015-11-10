import  React from "react";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import ListManagement from "components/common/list/ListManagement";
import {properties, keyColumn} from "data/types/ScheduledJob";
import {getFacilityContext} from "data/csapi";
import exposeRouter from 'components/common/exposerouter';
import {RouteHandler} from "react-router";

function editRouteFactory(row) {
    return {
        to: "scheduledjobedit",
        params: {type: row.get("type")}
    };
}

class ScheduledJobs extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            scheduledJobs: []
        };
    }

    findSchedule(props) {
        let selectedScheduleType = this.props.router.getCurrentParams().type;
        if (selectedScheduleType) {
            let {scheduledJobs} = this.state;
            this.setState({"scheduledJob": _.find(scheduledJobs, {type: selectedScheduleType})});
        }
    }

    handleUpdate() {
        this.componentWillMount();
    }

    componentWillMount() {
        getFacilityContext().getScheduledJobs().then((jobs) => {
            this.setState({"scheduledJobs": jobs});
        });
        this.findSchedule(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.findSchedule(nextProps);
    }

    render() {
        let columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
        let keyColumn = keyColumn;
        let {scheduledJobs = [], scheduledJob} = this.state;
        let rowActionComponent = ListManagement.toEditButton(editRouteFactory);
        return (<DocumentTitle title="ScheduledJobs">
                    <div>
                        <ListManagement results={scheduledJobs}
                                    keyColumn={keyColumn}
                                    columnMetadata={columnMetadata}
                                    rowActionComponent={rowActionComponent}/>
                        {(scheduledJob) ?
                            <RouteHandler scheduledJob={scheduledJob} onUpdate={this.handleUpdate.bind(this)} returnRoute="maintenance"/> : null}
                    </div>
                </DocumentTitle>
               );
    }
};
export default exposeRouter(ScheduledJobs);
