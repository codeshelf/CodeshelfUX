import {acAddUser, acUpdateUserForm, acUnsetError,
		    acStoreSelectedUserForm} from "./store.js";
import {UserForm} from "./UserForm.react.js";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import exposeRouter, {toURL} from 'components/common/exposerouter';
import {Map} from "immutable";
import _ from "lodash";

function mapDispatch(dispatch) {
    return bindActionCreators({
 				acAddUser,
 				updateForm: acUpdateUserForm,
 				acStoreSelectedUserForm,
        acUnsetError
 		    }, dispatch);
}

const mapStateToProps = (state) => {
	return {
		formData: state.users.itemForm,
    error: state.users.addItem.get('error')
	};
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
