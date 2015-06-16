import React from 'react';
import DocumentTitle from 'react-document-title';
import {Row, Col} from 'components/common/pagelayout';
import exposeRouter from 'components/common/exposerouter';
import {Input} from 'components/common/Form';
import {focusInvalidField} from '../../lib/validation';
import {getForm} from 'data/auth/store';
import {msg} from 'data/intl/store';
import {updateFormField, login, loginCookies} from 'data/auth/actions';
import {isLoggedIn} from 'data/user/store';

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
            }).catch(error => console.log("unable to authenticate with cookie", error));
        }
    }

  login(e) {
    e.preventDefault();
    const nextPath = this.props.router.getCurrentQuery().nextPath;
    const fields = getForm().toJS().fields;
    login(fields)
      .then(() => {
        // TODO: Probably use hard reload for Chrome to remember password.
        // https://code.google.com/p/chromium/issues/detail?id=43219#c56
        this.props.router.replaceWith(nextPath || '/');
      })
      .catch(focusInvalidField(this));
  }

  render() {
    const form = getForm().toJS();

    return (<DocumentTitle title="Login">
            <div className="register-container full-height sm-p-t-30">
                <div className="container-sm-height full-height">
                    <div className="row row-sm-height">
                        <div className="col-sm-12 col-sm-height col-middle">
                            <h1>Codeshelf Companion</h1>
            {form.error &&
                <span className="error-message">{form.error.message}</span>
            }

            <form id="login-form" className="p-t-15" role="form" method="POST" onSubmit={(e) => this.login(e)}>
                <input type="hidden" name="store" defaultValue={form.fields.store} />
                <Row>
                    <Col sm={12}>
                        <Input id="u"
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
                            <Input id="p"
                               label="Password"
                               disabled={login.pending}
                               name="password"
                               onChange={updateFormField}
                               type="password"
                               value={form.fields.password}
                             />
                    </Col>
                </Row>
                <button type="submit" disabled={login.pending} className="btn btn-primary btn-cons m-t-10">Login</button>
            </form>
            <p className="m-t"> <small>Codeshelf &copy; 2015</small> </p>

                        </div>
                    </div>
                </div>
            </div>
            </DocumentTitle>
    );
  }

}

Login.propTypes = {
  router: React.PropTypes.func
};

export default exposeRouter(Login);
