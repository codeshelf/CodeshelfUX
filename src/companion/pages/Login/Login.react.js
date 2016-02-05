import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from "react-router";
import {FormPageLayout, Row, Col} from 'components/common/pagelayout';
import exposeRouter from 'components/common/exposerouter';
import {Form, SubmitButton, ErrorDisplay, Input} from 'components/common/Form';

import {focusInvalidField} from '../../lib/validation';
import {getForm} from 'data/auth/store';
import {msg} from 'data/intl/store';
import {updateFormField, login, loginCookies} from 'data/auth/actions';
import {isLoggedIn, getStoredCredentials} from 'data/user/store';

require('assets/css/login.styl');

class Login extends React.Component {
    componentWillMount() {
      const nextPath = this.props.location.query.nextPath;
      if (isLoggedIn()) {
          this.transition(nextPath);
      } else {
        loginCookies().then(() => {
          console.log("authenticated by cookie");
          this.transition(nextPath);
        }, (error) => {
          console.log("unable to authenticate with cookie", error);
          let storedCredentials = getStoredCredentials();
          if (storedCredentials) {
            console.log("authenticating with stored credentials");
            this.handleLogin({email: storedCredentials.email,
              password: storedCredentials.password,
              store: true});
          }
        })
        .catch(error => console.log("unable to authenticate with cookie", error));
      }
    }

    transition(nextPath) {
      if (nextPath && nextPath.indexOf("http://") >= 0) {
        window.location.replace(nextPath);
      } else {
        // TODO: Probably use hard reload for Chrome to remember password.
        // https://code.google.com/p/chromium/issues/detail?id=43219#c56
        this.props.router.replace(nextPath || '/');
      }
    }

    handleLogin(fields) {
      const nextPath = this.props.location.query.nextPath;
      return login(fields).then(() => {
        this.transition();
      })
      .catch(focusInvalidField(this));
  }

  render() {
    const form = getForm().toJS();
    const title = "Codeshelf";
    return (<FormPageLayout title={title}>
                        {form.error &&
                            <ErrorDisplay message={form.error.message} />}

            <Form id="login-form" className="p-t-15" role="form" method="POST" onSubmit={(e) => {
                e.preventDefault();
                return this.handleLogin(form.fields);
            }}>
                <input type="hidden" name="store" defaultValue={form.fields.store} />
                <Row>
                    <Col sm={12}>
                        <Input id="email"
                               label="Username"
                               type="email"
                               autoFocus="true"
                               disabled={login.pending}
                               name="email"
                               onChange={updateFormField}
                               placeholder={msg('auth.form.placeholder.email')}
                               value={form.fields.email}
                         />
                   </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                            <Input id="password"
                               label="Password"
                               disabled={login.pending}
                               name="password"
                               onChange={updateFormField}
                               type="password"
                               value={form.fields.password}
                             />
                    </Col>
                </Row>
          <Row>
            <Col sm={12} >
              <Link to="/password/recovery" >Forgot Password</Link>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="pull-right">
                <SubmitButton label="Login" />
              </div>
            </Col>
          </Row>

            </Form>
            <p className="m-t"> <small>Codeshelf &copy; 2016</small> </p>
            </FormPageLayout>
    );
  }

}

Login.propTypes = {
  router: React.PropTypes.object.isRequired
};

export default exposeRouter(Login);
