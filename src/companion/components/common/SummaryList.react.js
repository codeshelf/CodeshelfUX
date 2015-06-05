import  React from "react";
import {ListGroup, ListGroupItem, Badge} from "react-bootstrap";
import _ from "lodash";
export default class SummaryList extends React.Component{

    constructor(props) {
        super(props);

/* expected data shape
        [
            {
                label: "label 1",
                description: "large description",
                quantity: 3
            }
        ]
*/
    }

    render() {
        let list = this.props.list || [];
        return (
                <ListGroup>
                {
                    _.map(list, function(dataItem) {
                        let {label} = dataItem;
                        let {id = label, description, quantity} = dataItem;
                        return <ListGroupItem
                                key={id}
                                active={false} >
                            <Badge className="text-right">{quantity}</Badge>
                            <div className="text-left">
                                <div>{label} </div>
                                <div><small>{description}</small></div>
                            </div>
                            </ListGroupItem>;
                    }.bind(this))
                }
            </ListGroup>

        );
    }
};
