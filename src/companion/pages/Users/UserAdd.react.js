import {acAddUser, acUpdateUserForm, 
		acStoreSelectedUserForm} from "./store.js";
import {UserForm} from "./UserForm.js";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Map} from "immutable";
import _ from "lodash";

function mapDispatch(dispatch) {
    return bindActionCreators({
 				acAddUser,
 				updateForm: acUpdateUserForm,
 				acStoreSelectedUserForm
 		    }, dispatch);
}

const mapStateToProps = (state) => {
	return {
		formData: state.users.userForm
	};
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
