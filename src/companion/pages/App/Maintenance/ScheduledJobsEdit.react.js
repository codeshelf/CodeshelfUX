import  React from 'react';
import {fromJS} from 'immutable';
import ModalForm from "components/common/ModalForm";
import {getFacilityContext} from "data/csapi";
import {ErrorDisplay, Input} from "components/common/Form";

export default class ScheduledJobEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduledJob: props.scheduledJob
        };
    }

    handleSave() {
        let {scheduledJob} = this.state;
            return getFacilityContext().updateSchedule(scheduledJob.type, scheduledJob).then((newSchedule) => {
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
                    <ErrorDisplay message={errorMessage} />
                    <Input ref="schedule" label="Schedule" value={scheduledJob.cronExpression} onChange={this.handleCronExpressionChange.bind(this)} />
                </ModalForm>);
    }
};

ScheduledJobEdit.propTypes = {
    scheduledJob: React.PropTypes.object.isRequired
};
