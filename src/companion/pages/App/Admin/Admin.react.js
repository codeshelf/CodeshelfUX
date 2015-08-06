import React from 'react';
import DocumentTitle from 'react-document-title';
import {RouteHandler} from 'react-router';
import AdminNavigation from './AdminNavigation';
import TopNavBar from '../TopNavBar.react';
import Footer from '../Footer.react.js';
import {isLoggedIn, getSelectedTenant} from 'data/user/store';


export default class Admin extends React.Component {
    componentWillMount() {
        document.body.classList.add("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
    }

    render() {
        let {state} = this.props;
        let tenant = getSelectedTenant();
        let tenantName = tenant && tenant.get("name");
        return (
            <DocumentTitle title='CS Companion Admin'>
                <div>
                    <AdminNavigation title={tenantName} />
                    <div id="page-wrapper" className="page-container">
                    <TopNavBar title={tenantName} />
                        <div className="page-content-wrapper">
                            <div className="content">
                                <RouteHandler state={state}/>
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentTitle>);
    }
};
