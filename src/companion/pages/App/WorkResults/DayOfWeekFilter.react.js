import React from 'react';
import {ButtonGroup, Button} from 'react-bootstrap';
import {IBox, IBoxTitleBar, IBoxTitleText, IBoxSection} from "components/common/IBox";
import PickerEventsChart from './PickerEventsChart';
import moment from 'moment';

class ButtonFilter extends  React.Component {
    render() {
        var {onClick, selectedValue, value} = this.props;
        var wrapperCallback = function() {
            onClick(value);
        };
        return (<Button bsStyle="primary"
                 onClick={wrapperCallback}
                 active={selectedValue == value}>
                    {this.props.children}
                </Button>);
    }

}


export default class DayOfWeek extends React.Component {

    constructor() {
        this.state = {
            "selectedValue" : "today"
        };
    }

    render() {
        var {numDays, onClick} = this.props;
        var {selectedValue} = this.state;
        return (
            <div>
                {
                    _.range(1,numDays+1).reverse().map(function(index){
                        var dayOfWeek = moment().subtract(index, 'days').format('dd');
                        return (<ButtonFilter onClick={onClick} selectedValue={selectedValue} value={index + " days ago"}>{dayOfWeek}</ButtonFilter>);
                    })

                }
                <ButtonFilter onClick={onClick} selectedValue={selectedValue} value="today">Today</ButtonFilter>
            </div>
        );

    }
};
