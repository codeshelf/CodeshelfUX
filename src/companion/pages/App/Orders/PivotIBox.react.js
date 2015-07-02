import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from "components/common/pagelayout";
import {IBox, IBoxTitleBar, IBoxBody, IBoxSection, IBoxTitleText} from 'components/common/IBox';
import {Button} from "react-bootstrap";
import {getFacilityContext} from "data/csapi";
require("jquery-ui");
//use a small customer loader to add a line ending
require("imports?this=>window!../../../lib/newline-loader.js!pivottable");

import  {fromJS} from "immutable";

require("./pivottable.css");

class PivotTable extends React.Component {

    renderPivotTable(props) {
        let el = React.findDOMNode(this);
        let jqEl = $(el);
        //jqEl.empty();
        jqEl.pivotUI(props.orders.toJS(), props.options.toJS());
    }

    componentDidMount() {
        this.renderPivotTable(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.renderPivotTable(nextProps);
    }

    render() {
        return (<div>Table</div>);
    }
}

export default class PivotIBox extends React.Component{

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        getFacilityContext().findOrders().then((data) =>{
            this.getOrdersCursor()((orders) =>{
                return orders.clear().concat(fromJS(data));
            });
        });
    }

    getOrdersCursor() {
        let {state}=  this.props;
        return state.cursor(["pivot", "orders"]);
    }

    getOptionsCursor() {
        let {state}=  this.props;
        return state.cursor(["pivot", "options"]);
    }


    render() {
        let orders = this.getOrdersCursor()();
        let options = this.getOptionsCursor()();
        return (
                <IBox style={{display: "inline-block"}}>
                <IBoxTitleBar>
                <IBoxTitleText>
                    Orders
                </IBoxTitleText>
                <div className="panel-controls">
                    <ul>
                        <li><a href="#" className="portlet-refresh text-black" data-toggle="refresh"
                                onClick={this.handleRefresh.bind(this)}
                             ><i className="portlet-icon portlet-icon-refresh"></i></a>
                        </li>
                    </ul>
                </div>
                </IBoxTitleBar>
                <IBoxBody>
                <div style={{display: "inline-block"}}>
                <div className="text-right" >
                </div>
                <PivotTable orders={orders} options={options}/>
                </div>
                </IBoxBody>
                </IBox>);

    }
};
