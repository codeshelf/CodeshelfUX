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
        super();
        this.today = 0;
        this.state = {
            "value" : 0
        };
    }


    handleButtonClick(value, e) {
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
                        var dayOfWeek = moment().subtract(index, 'days').local().format('dd');
                        var buttonValue = index;
                        return (<ButtonFilter key={buttonValue} onClick={this.handleButtonClick.bind(this, buttonValue)} selectedValue={value} value={buttonValue}>{dayOfWeek}</ButtonFilter>);
                    }.bind(this))

                }
                <ButtonFilter key="today" onClick={this.handleButtonClick.bind(this, this.today)} selectedValue={value} value={this.today}>Today</ButtonFilter>
            </div>
        );

    }
};
