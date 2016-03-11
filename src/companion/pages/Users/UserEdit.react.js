import {UserForm} from "./UserForm.react.js";
import {Map} from "immutable";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {acEditUser, acUpdateUserForm, acUnsetError,
        acStoreSelectedUserForm} from "./store.js";
import exposeRouter, {toURL} from 'components/common/exposerouter';
import _ from "lodash";


function mapDispatch(dispatch) {
    return bindActionCreators({
        acEditUser,
        updateForm: acUpdateUserForm,
        acStoreSelectedUserForm,
        acUnsetError
        }, dispatch);
}

const mapStateToProps = (state) => {
  return {
    formData: state.users.itemForm,
    error: state.users.updateItem.get('error')
  };
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
