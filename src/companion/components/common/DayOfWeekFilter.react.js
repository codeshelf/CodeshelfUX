import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
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


function priorDay(daysBack) {
    return moment().subtract(daysBack, 'days').local();
}

class Interval {
    constructor(start, end) {
        this.start = moment(start);
        this.end = moment(end);
    }

    toQueryParameterValue() {
        return `${this.start.toISOString()}/${this.end.toISOString()}`;
    }
}

export default class DayOfWeekFilter extends React.Component {

    static priorDayInterval(daysBack) {
        return new Interval(
            priorDay(daysBack).startOf('day'),
            priorDay(daysBack).endOf('day')
        );
    }

    constructor() {
        super();
        this.today = 0;
        this.state = {
            "value" : 0
        };
    }

    getInterval() {
        return DayOfWeekFilter.priorDayInterval(this.state.value);
    }

    handleButtonClick(value, e) {
        this.setState({value: value}, () => {
          this.props.onChange(value);
        });
    }

    render() {
        var {numDays} = this.props;
        var {value} = this.state;
        return (
          <div>
            <div>
              <label style={{display: "inline", marginRight: "0.5em"}}>Days Ago</label>
                <input type="number" value={value} onChange={(e) => {this.handleButtonClick(e.target.value, e);}} style={{width: "3.5em", paddingLeft: "0.5em"}}/>
              </div>
              <ButtonGroup>

                {
                    _.range(1,numDays+1).reverse().map(function(index){
                        var dayOfWeek = moment().subtract(index, 'days').local().format('dd');
                        var buttonValue = index;
                        return (<ButtonFilter key={buttonValue} onClick={this.handleButtonClick.bind(this, buttonValue)} selectedValue={value} value={buttonValue}>{dayOfWeek}</ButtonFilter>);
                    }.bind(this))

                }
                <ButtonFilter key="today" onClick={this.handleButtonClick.bind(this, this.today)} selectedValue={value} value={this.today}>Today</ButtonFilter>
              </ButtonGroup>
            </div>
        );

    }
};
