/*
IBox
 - Independently Refreshable Section of a screen.
 - An IBox has a title and a refresh button
 - Most pages only have one IBox

Refresh
 - Refreshes the content within the box (filtered etc)
 - If the content has tabs, only refreshes active tab

Margins
 The current IBox CSS uses 20px bottom margin. The IBox does not have any other margins.  All other "margins" are driven by the padding of the grid system.

Structure
 * TitleBar
 ** Title
 ** Controls
 * Body
 ** Section

Common Single Section IBox (Called SingleCellIBox)

*/

import React from "react";
import pluralize from "lib/pluralize";
import classNames from "classnames";
import Promise from "bluebird";

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

class IBoxBody extends React.Component {
    render() {
       return (<div className="panel-body">
            {this.props.children}
        </div>);
    }
}

var IBox = RClass(function() {
    let classes = classNames("panel", "panel-default", this.props.className);
    let {style} = this.props;
    return (<div data-pages="portlet" className={classes} style={style}>
                {this.props.children}
            </div>);
});

class IBoxControls extends React.Component {
    render() {
        let {onRefresh, isRefreshing} = this.props;
        let refreshButton = classNames({
            "portlet-icon": true,
            "portlet-icon-refresh-lg-master" : true,
            "fade" : isRefreshing
        } );
        let refreshingButton = classNames({
            "portlet-icon-refresh-lg-master-animated": true,
            "active": isRefreshing
        });

        return (
            <div className="panel-controls">
                <ul>
                    <li>
                        <a href="#" className="portlet-refresh text-black" data-toggle="refresh"
                            onClick={onRefresh}>
                            <i className={refreshButton}  title="Refresh"></i>
                            <i className={refreshingButton} style={{position: "absolute", top: 17}} title="Refreshing"></i>

                        </a>
                    </li>
                </ul>
            </div>);
    }
}
IBoxControls.displayName = "IBoxControls";

export class SingleCellIBox extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {title, style, isRefreshing, onRefresh} = this.props;
        return (
                <IBox style={style}>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            {title}
                        </IBoxTitleText>
                        {(onRefresh) ?
                            <IBoxControls {...{onRefresh, isRefreshing}}/>
                                : null
                        }
                    </IBoxTitleBar>
                    <IBoxBody>
                        {this.props.children}
                    </IBoxBody>
                </IBox>
        );
    }
}
SingleCellIBox.displayName = "SingleCellIBox";

module.exports = {
    IBox: IBox,
    IBoxData: IBoxData,
    IBoxTitleBar: IBoxTitleBar,
    IBoxTitleText: IBoxTitleText,
    IBoxSection: IBoxSection,
    IBoxBody: IBoxBody,
    SingleCellIBox: SingleCellIBox
};
