import React from 'react';
import DocumentTitle from 'react-document-title';
import {Row, Col} from 'components/common/pagelayout';
import exposeRouter from 'components/common/exposerouter';
import {Input} from 'components/common/Form';
import {focusInvalidField} from '../../lib/validation';
import {getForm} from 'data/auth/store';
import {msg} from 'data/intl/store';
import {isLoggedIn, getStoredCredentials} from 'data/user/store';
import {changePassword} from "data/csapi";
import {validate} from 'validation';
import {ValidationError} from 'lib/validation';

class ChangePassword extends React.Component {

  handleSubmit(formCursor) {
    const nextPath = this.props.router.getCurrentQuery().nextPath;
      validate(formCursor().get("values").toJS()).prop("new").matchesProp("confirm").promise
          .then(() =>{
              return changePassword(formCursor().getIn(["values", "old"]),  formCursor().getIn(["values", "new"]));
          })
          .then(() => {
              formCursor((form) =>{
                  return form.set("errors", form.get("errors").clear());
              });
              // TODO: Probably use hard reload for Chrome to remember password.
              // https://code.google.com/p/chromium/issues/detail?id=43219#c56
              this.props.router.replaceWith(nextPath || '/');
          })
          .catch((error) =>{
              console.log(error);
              if (error instanceof ValidationError) {
                  formCursor((form) => {
                      return form.setIn(["errors", error.prop], [error.message]);
                  });
              } else if (error.status == 400) {
                  let errors = error.body.fieldErrors;
                  for(var key in errors) {
                      formCursor((form) => {
                          return form.setIn(["errors", key], ["Invalid"]);
                      });
                  }
              }
          });
  }

  handleFormChange({target: {name, value}}) {
      let form = this.getFormCursor();
      form((formState) => {
          return formState.setIn(["values", name], value);
      });
  }

  getFormCursor() {
      let {state} = this.props;
      let formCursor = state.cursor(["auth", "changepassword"]);
      return formCursor;

  }

  render() {
    let formCursor = this.getFormCursor();
    const changePasswordMsg = "Change Password";

    return (<DocumentTitle title={changePasswordMsg}>
            <div className="register-container full-height sm-p-t-30">
                <div className="container-sm-height full-height">
                    <div className="row row-sm-height">
                        <div className="col-sm-12 col-sm-height col-middle">
                            <h1>{changePasswordMsg}</h1>
            <form id="changepassword-form" className="p-t-15" role="form" method="POST" onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmit(formCursor);
            }}>
                {this.renderPasswordField(formCursor(), "old", "Current Password")}
                {this.renderPasswordField(formCursor(), "new", "New Password")}
                {this.renderPasswordField(formCursor(), "confirm", "Confirm New Password")}
                <button type="submit" disabled={changePassword.pending} className="btn btn-primary btn-cons m-t-10">{changePasswordMsg}</button>
            </form>
                        </div>
                    </div>
                </div>
            </div>
            </DocumentTitle>
    );
  }

  renderPasswordField(form, id, label) {
      let values = form.get("values");
      let errors = form.get("errors");
      return (
          <Row>
              <Col sm={12}>
                  <Input id={id}
                   label={label}
                   disabled={changePassword.pending}
                   name={id}
                   onChange={this.handleFormChange.bind(this)}
                   type="password"
                   value={values.get(id)}
                   errors={errors.get(id)}
                   />
              </Col>
          </Row>
      );
  }

}

ChangePassword.propTypes = {
  router: React.PropTypes.func
};

export default exposeRouter(ChangePassword);
