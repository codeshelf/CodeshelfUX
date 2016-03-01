import {acAddUser, acUpdateAddUserForm} from "./store.js";
import {UserForm} from "./UserForm.js";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Map} from "immutable";


function mapDispatch(dispatch) {
    return bindActionCreators({
 				acAddUser,
 				acUpdateAddUserForm
 		    }, dispatch);
}

const mapStateToProps = (state) => {
	return {
		formData: state.users.addUserForm
	};
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
