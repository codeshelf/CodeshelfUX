import  React from "react";
import  {Link} from "react-router";
import {FormPageLayout, Row, Col} from 'components/common/pagelayout';


export default class RecoverSuccess extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<FormPageLayout title="Reset Password Email Sent" >
                <h3>Check your email and follow the link</h3>
                <h3>to reset your password</h3>
                <div>If you don't see the email check your span or junk mail folder, as it may have been blocked by your email security settings.</div>
                <div>
                    <Link to="login">Back to Login</Link>
                </div>
                </FormPageLayout>
    );
    }
};
