import  React from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {acLoadUsers} from "./store.js";
import {UsersList} from "./UsersList.react.js";
import {List} from "immutable";

//TODO remove when in redux store
import {getEmail} from "data/user/store";


class Users extends React.Component{

    componentWillMount() {
      this.props.acLoadUsers();
    }

    componentWillReceiveProps() {

    }

    render() {
      return (
        <div>
          <UsersList {...this.props} />
          {this.props.children &&  React.cloneElement(this.props.children, {...this.props })}
        </div>);
    }
};

function mapStateToProps(state) {
  return {
    users: state.users.users.get('data'),
    currentUser: state.currentUser || {username: getEmail()}
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acLoadUsers}, dispatch);
}

export default connect(mapStateToProps, mapDispatch)(Users);
