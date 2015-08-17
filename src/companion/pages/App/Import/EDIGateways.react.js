import  React from "react";
import DocumentTitle from "react-document-title";
    import {RouteHandler, Link} from "react-router";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import {List} from "immutable";
import SFTPImportEdit from "./SFTPImportEdit.react.js";
export default class EDIGateways extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let persistentId = "a";
        return (<DocumentTitle title="EDIGateways">
                    <SFTPImportEdit />
                </DocumentTitle>
               );
    }
};
