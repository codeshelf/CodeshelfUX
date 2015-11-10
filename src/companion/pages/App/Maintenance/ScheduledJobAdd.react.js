import  React from "react";
import AddModalForm from "components/common/list/AddModalForm";
import {getFacilityContext} from "data/csapi";

export default class ScheduledJobAdd extends React.Component{

    render() {
        return (<AddModalForm title="Add Scheduled Job"
                    addAction={getFacilityContext().addScheduledJob}
                    {...this.props} />);
    }
};
