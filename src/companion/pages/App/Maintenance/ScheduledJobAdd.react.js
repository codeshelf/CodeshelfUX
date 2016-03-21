import  React from "react";
import AddModalForm from "components/common/list/AddModalForm";
import {getAPIContext} from "data/csapi";

export default class ScheduledJobAdd extends React.Component{

    render() {
        return (<AddModalForm title="Add Scheduled Job"
                    addAction={getAPIContext().addScheduledJob}
                    {...this.props} />);
    }
};
