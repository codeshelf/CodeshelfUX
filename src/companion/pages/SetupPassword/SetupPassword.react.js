import React from 'react';
import {Link} from "react-router";
import DocumentTitle from 'react-document-title';
import {FormPageLayout, Row, Col} from 'components/common/pagelayout';
import exposeRouter from 'components/common/exposerouter';
  import {Form, Input, SubmitButton, ErrorDisplay} from 'components/common/Form';
import {focusInvalidField} from '../../lib/validation';
import {getForm} from 'data/auth/store';
import {msg} from 'data/intl/store';
import {isLoggedIn, getStoredCredentials} from 'data/user/store';
import {validate} from 'validation';
import {ValidationError} from 'lib/validation';

import {setupPassword} from "data/csapi";
const title = "Setup Codeshelf Password";
const fields = [{name: "new", label: "New Password"},
                {name: "confirm", label: "Confirm Password"}
                    ];
const statePath = ["auth", "setuppassword"];
function executePasswordAction(props, form) {
    let queryData = props.router.getCurrentQuery();
    let newPassword = form.getIn(["values", "new"]);
    return setupPassword(newPassword, queryData);
}

class SetupPassword extends React.Component {

  componentWillUnmount() {
      this.resetForm(this.getFormCursor());
  }

  resetForm(formCursor) {
      formCursor((form) =>{
          return form.set("values", form.get("values").clear());
          return form.set("errors", form.get("errors").clear());
      });

  }

  handleSubmit(formCursor) {
    const nextPath = this.props.router.getCurrentQuery().nextPath;
    return validate(formCursor().get("values").toJS())
        .prop("new").matchesProp("confirm").promise
        .then(() => {

          formCursor((form) =>{
            return form.set("errors", form.get("errors").clear());
          });
        })
        .then(() => {
          return executePasswordAction(this.props, formCursor());
        })
        .then(() => {
          this.resetForm(formCursor);
          // TODO: Probably use hard reload for Chrome to remember password.
          // https://code.google.com/p/chromium/issues/detail?id=43219#c56
          this.props.router.replaceWith(nextPath || '/');
        })
        /* Not sure why the type doesn't come through
        .catch(ValidationError,  (error) =>{
          formCursor((form) => {
            return form.setIn(["errors", error.prop], [error.message]);
          });
            })*/
        .catch((error)=>{
          if (error.prop) {
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
          } else if (error.status == 403) {
            formCursor((form) => {
              return form.setIn(["errors", "_general"], ["The reset period for your link has expired. Generate a new link and try again. If the problem persists, contact Customer Support"]);
            });
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
      let formCursor = state.cursor(statePath);
      return formCursor;

  }

  render() {
      let formCursor = this.getFormCursor();
      let generalError = formCursor().getIn(["errors", "_general"], null);

      return (<FormPageLayout  title={title}>
          {generalError &&
               <ErrorDisplay message={generalError} />}

            <h3>Setup your account password below</h3>
            <Form id="changepassword-form" className="p-t-15" role="form" method="POST" onSubmit={(e) => {
                e.preventDefault();
                return this.handleSubmit(formCursor);
                }}>
                        {
                            fields.map((field) => {
                                let {name, label} = field;
                                return this.renderPasswordField(formCursor(), name, label);
                            })
                        }
                        <Row>
                          <Col sm={12} >
                            <Link to="recoverpassword" >Regenerate Recovery Email</Link>
                          </Col>
                        </Row>

                        <Row>
                        <Col sm={12}>
                        <div className="pull-right">
                            <SubmitButton label="Setup" />
                        </div>
                        </Col>
                </Row>

            </Form>

                </FormPageLayout>
    );
  }

  renderPasswordField(form, id, label) {
      let values = form.get("values");
      let errors = form.get("errors");
      return (
          <Row key={id}>
              <Col sm={12}>
                  <Input id={id}
                   label={label}
                   disabled={executePasswordAction.pending}
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

SetupPassword.propTypes = {
  router: React.PropTypes.func
};

export default exposeRouter(SetupPassword);
