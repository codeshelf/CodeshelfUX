var React = require("react");
var pluralize = require("lib/pluralize");
function RClass(renderFunction, otherMethods) {
    return React.createClass({
        render: renderFunction
    });
}


export class IBoxData extends React.Component {

    render() {
        var label = pluralize(this.props.dataValue, this.props.dataLabelSingular, this.props.dataLabel);
        return (<h1>
                 {this.props.dataValue} {label}
            </h1>);
    }
};

var IBoxTitleText = RClass(function() {
    /* Note that we are turning off float when no tools but when there are tools we will need to let it float left */
        return (<div className="panel-title">{this.props.children}</div>);
    });

var IBoxTitleBar = RClass(function() {
    return (<div className="panel-heading">
            {this.props.children}
            </div>);
    });

var IBoxSection = RClass(function() {
    return (<div className="ibox-content text-center">
                {this.props.children}
            </div>);
    });

var IBox = RClass(function() {
    return (<div data-pages="portlet" className="panel panel-default">
                {this.props.children}
            </div>);
});

module.exports = {
    IBox: IBox,
    IBoxData: IBoxData,
    IBoxTitleBar: IBoxTitleBar,
    IBoxTitleText: IBoxTitleText,
    IBoxSection: IBoxSection
};
