import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import moment from 'moment';

class ButtonFilter extends  React.Component {

    handleClick(onClick, value, e) {
        onClick(value);
    }
    render() {
        var {onClick, selectedValue, value} = this.props;
        return (<Button bsStyle="primary"
                 onClick={this.handleClick.bind(this, onClick, value)}
                 active={selectedValue == value}>
                    {this.props.children}
                </Button>);
    }

}


export default class DayOfWeekFilter extends React.Component {

    constructor() {
        this.state = {
            "value" : "today"
        };
    }

    handleButtonClick(value) {
        this.setState({value: value});
        var {onChange} = this.props;
        onChange(value);
    }

    render() {
        var {numDays} = this.props;
        var {value} = this.state;
        return (
            <div>
                {
                    _.range(1,numDays+1).reverse().map(function(index){
                        var dayOfWeek = moment().subtract(index, 'days').format('dd');
                        return (<ButtonFilter key={dayOfWeek} onClick={this.handleButtonClick.bind(this)} selectedValue={value} value={index + " days ago"}>{dayOfWeek}</ButtonFilter>);
                    }.bind(this))

                }
                <ButtonFilter key="today" onClick={this.handleButtonClick.bind(this)} selectedValue={value} value="today">Today</ButtonFilter>
            </div>
        );

    }
};
