import  React from "react";
import {RouteHandler} from "react-router";
import DocumentTitle from "react-document-title";
import {getUsers, resendNewUserEmail} from "data/csapi";
import {Button} from "components/common/bootstrap";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import ListView from "components/common/list/ListView";
import {properties, keyColumn} from "data/types/User";
import {fromJS} from "immutable";

export default class Users extends React.Component{

    constructor(props) {
        super(props);
        this.state = {users: []};

    }

    componentDidMount() {
        getUsers().then((users) => {
            this.setState({users: fromJS(users)});
        });
    }

    render() {
        let {state} = this.props;
        let {users} = this.state;
        let columnsCursor  = state.cursor(["preferences", "users", "table", "columns"]);
        let columnSortSpecsCursor = state.cursor(["preferences", "users", "table", "sortSpecs"]);
        let columnMetadata = ListView.toColumnMetadataFromProperties(properties);
        debugger;
            return (<DocumentTitle title="Users">
                <div>
                    <AddButtonLink to="usernew" />

                    <div>Users</div>
                    <ListView results={users}
                            columns={columnsCursor}
                            sortSpecs={columnSortSpecsCursor}
                            columnMetadata={columnMetadata}/>
                       <RouteHandler />
                   </div>


                </DocumentTitle>
               );
    }
};
