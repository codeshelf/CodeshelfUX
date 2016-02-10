import  React from 'react';
import {fromJS} from 'immutable';
import ModalForm from "components/common/ModalForm";
import {getAPIContext} from "data/csapi";
import {ErrorDisplay, Input} from "components/common/Form";
import ScheduledJobForm from "./ScheduleJobsForm.react.js";

export default class ScheduledJobEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduledJob: props.scheduledJob
        };
    }

    handleSave() {
        let scheduledJob = this.refs.form.getFormData();
    return getAPIContext().updateSchedule(scheduledJob.get("type"), scheduledJob.toJS()).then((newSchedule) => {
            return this.props.onUpdate(newSchedule);
        })
        .catch((e) =>{
            if (e.body) {
                this.setState({errorMessage: e.body.errors[0]});
            } else {
                this.setState({errorMessage: e.message});
            }

            throw e;
        });
    }

    handleCronExpressionChange(e) {
        let {scheduledJob} = this.state;
        scheduledJob.cronExpression = e.target.value;
        this.setState({scheduledJob: scheduledJob});
    }

    render() {
        var {returnRoute} = this.props;
        const {errorMessage, scheduledJob = {}} = this.state;
        return (<ModalForm title="Edit Job Schedule" formData={scheduledJob} returnRoute={returnRoute} onSave={this.handleSave.bind(this)}>
                    <ScheduledJobForm ref="form" message={errorMessage} formData={scheduledJob}/>
                </ModalForm>);
    }
};

ScheduledJobEdit.propTypes = {
    scheduledJob: React.PropTypes.object.isRequired
};
