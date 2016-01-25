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
        if (isLoggedIn()) {
            const nextPath = this.props.router.getCurrentQuery().nextPath;
            if (nextPath && nextPath.indexOf("http://") >= 0) {
                window.location.replace(nextPath);
            } else {
                // TODO: Probably use hard reload for Chrome to remember password.
                // https://code.google.com/p/chromium/issues/detail?id=43219#c56
                this.props.router.replaceWith(nextPath || '/');
            }
        } else {
            loginCookies().then(() => {
                console.log("authenticated by cookie");
                const nextPath = this.props.router.getCurrentQuery().nextPath;
                if (nextPath && nextPath.indexOf("http://") >= 0) {
                    window.location.replace(nextPath);
                } else {
                    // TODO: Probably use hard reload for Chrome to remember password.
                    // https://code.google.com/p/chromium/issues/detail?id=43219#c56
                    this.props.router.replaceWith(nextPath || '/');
                }
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

  handleLogin(fields) {
    const nextPath = this.props.router.getCurrentQuery().nextPath;
    return login(fields)
      .then(() => {
        // TODO: Probably use hard reload for Chrome to remember password.
        // https://code.google.com/p/chromium/issues/detail?id=43219#c56
        this.props.router.replaceWith(nextPath || '/');
      })
      .catch(focusInvalidField(this));
  }

  render() {
    const form = getForm().toJS();
    const title = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? "Pocket Codeshelf"
      : "Codeshelf Companion";
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
              <Link to="recoverpassword" >Forgot Password</Link>
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
  router: React.PropTypes.func
};

export default exposeRouter(Login);
