import {UserForm, getFormMetadata} from "./UserForm.js";
import {Map} from "immutable";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {acEditUser, acUpdateUserForm} from "./store.js";
import exposeRouter, {toURL} from 'components/common/exposerouter';
import _ from "lodash";

const fields = ["id", "username", "active", "roles"];

const editFormMetadata = () => {
  return _.chain(getFormMetadata())
          .filter((m) => fields.indexOf(m.name) >= 0)
          .map((m) => {
            if (m.name == "username") {
              let editM = _.clone(m);
              editM.readOnly = "true";
              editM.required = false;
              return editM;
            } else {
              return m;
            }
          }).value();
}

function mapDispatch(dispatch) {
    return bindActionCreators({
        acEditUser,
        updateForm: acUpdateUserForm
        }, dispatch);
}

const mapStateToProps = (state) => {
  return {
    formData: state.users.userForm,
    formMetadata: editFormMetadata
  };
}
export default exposeRouter(connect(mapStateToProps, mapDispatch)(UserForm));
