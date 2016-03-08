import {UserForm} from "./UserForm.react.js";
import {Map} from "immutable";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {acEditUser, acUpdateUserForm, 
        acStoreSelectedUserForm} from "./store.js";
import exposeRouter, {toURL} from 'components/common/exposerouter';
import _ from "lodash";


function mapDispatch(dispatch) {
    return bindActionCreators({
        acEditUser,
        updateForm: acUpdateUserForm,
        acStoreSelectedUserForm
        }, dispatch);
}

const mapStateToProps = (state) => {
  return {
    formData: state.users.itemForm
  };
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
