import {acAddUser, acUpdateUserForm} from "./store.js";
import {UserForm, getFormMetadata} from "./UserForm.js";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Map} from "immutable";
import _ from "lodash";

const addFormMetadata = () => {
    const fields = ["username", "roles"];
    return _.filter(getFormMetadata(), (m) => fields.indexOf(m.name) >= 0);
}

function mapDispatch(dispatch) {
    return bindActionCreators({
 				acAddUser,
 				updateForm: acUpdateUserForm
 		    }, dispatch);
}

const mapStateToProps = (state) => {
	return {
		formData: state.users.userForm,
		formMetadata: addFormMetadata
	};
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
