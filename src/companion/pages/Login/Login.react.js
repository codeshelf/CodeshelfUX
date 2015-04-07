import React from 'react';
import exposeRouter from 'components/common/exposerouter';
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
            });
        }
    }

  login(e) {
    e.preventDefault();
    const nextPath = this.props.router.getCurrentQuery().nextPath;
    const fields = getForm().toJS().fields;

    login(fields)
      .catch(focusInvalidField(this))
      .then(() => {
        // TODO: Probably use hard reload for Chrome to remember password.
        // https://code.google.com/p/chromium/issues/detail?id=43219#c56
        this.props.router.replaceWith(nextPath || '/');
      });
  }

  render() {
    const form = getForm().toJS();

    return (
    <div className="middle-box text-center loginscreen  animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">CS</h1>
            </div>
            <h3>Welcome to CS Companion</h3>
            {form.error &&
                <span className="error-message">{form.error.message}</span>
            }

          {/*  <div id="form-messages" className="alert alert-danger" style="display:none">
              We didn't recognize your <br />username and password. Try again.
            </div>
            */}
            <form id="login-form" className="m-t" role="form" method="POST" onSubmit={(e) => this.login(e)}>
            <div className="form-group">
                <input className="form-control"
                    type="email"
                    autoFocus="true"
                    disabled={login.pending}
                    name="email"
                    onChange={updateFormField}
                    placeholder={msg('auth.form.placeholder.email')}
                    value={form.fields.email}
                />
            </div>
            <div className="form-group">
                <input className="form-control"
                       disabled={login.pending}
                       name="password"
                       onChange={updateFormField}
                       placeholder={msg('auth.form.placeholder.password')}
                       type="password"
                       value={form.fields.password}
                />
                </div>
                <button type="submit" disabled={login.pending} className="btn btn-primary block full-width m-b">Login</button>
<!--                <a href="#"><small>Forgot password?</small></a> -->
            </form>
            <p className="m-t"> <small>Codeshelf &copy; 2015</small> </p>
        </div>
    </div>

    );
  }

}

Login.propTypes = {
  router: React.PropTypes.func
};

export default exposeRouter(Login);
