import  React from "react";
import {RouteHandler} from "react-router";
import DocumentTitle from "react-document-title";
import {getUsers, resendNewUserEmail} from "data/csapi";
import {Button} from "components/common/bootstrap";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
import {properties, keyColumn} from "data/types/User";
import {fromJS, List} from "immutable";

export default class Users extends React.Component{

    constructor(props) {
        super(props);
        this.state = {users: List()};

    }

    updateUsers() {
        return getUsers().then((users) => {
            this.setState({users: fromJS(users)});
        });
    }

    componentWillMount() {
        this.updateUsers();
    }

    componentWillReceiveProps() {
        this.updateUsers();
    }

    render() {
        let {state} = this.props;
        let {users} = this.state;
        let columnsCursor  = state.cursor(["preferences", "users", "table", "columns"]);
        let columnSortSpecsCursor = state.cursor(["preferences", "users", "table", "sortSpecs"]);
        let columnMetadata = ListView.toColumnMetadataFromProperties(properties)
                .concat([new ListView.ColumnRecord({
                    columnName: "action",
                    displayName: "",
                    customComponent: ListManagement.toEditButton((row) => {
                        return {    to: "useredit",
                                params: {userId: row.get(keyColumn)}};
                    })
                })]);
        return (<DocumentTitle title="Users">
                <div>
                    <ListManagement
                        addButtonRoute="usernew"

                        results={users}
                        keyColumn={keyColumn}
                        columns={columnsCursor}
                        sortSpecs={columnSortSpecsCursor}
                        columnMetadata={columnMetadata} />

                <RouteHandler users={users}/>
                </div>
                </DocumentTitle>
               );
    }
};
