import DocumentTitle from 'react-document-title';
import React from 'react';
import {Link, RouteHandler} from 'react-router';
import {fetchFacilities, selectFirstFacility, selectFacilityByName} from 'data/facilities/actions';
import {getSelectedFacility} from 'data/facilities/store';
import {isLoggedIn, getSelectedTenant} from 'data/user/store';
import exposeRouter from 'components/common/exposerouter';

import 'bootstrap/less/bootstrap.less';
import 'pages/less/pages.less';
require('assets/css/app.styl');

class App extends React.Component {

    componentWillMount() {
        fetchFacilities();
        this.handleRouting(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleRouting(nextProps);
    }

    handleRouting(props) {
        var router = props.router;
        var params = router.getCurrentParams();
        var facilityName = params.facilityName;
        const facility = getSelectedFacility();
        if (facilityName != null) {
            if (!facility || (facility && facility.domainId !== facilityName)) {
                selectFacilityByName(facilityName);
            }
        } else if (facility != null) {
            router.transitionTo("facility", {facilityName: facility.domainId});
        } else {
            selectFirstFacility();
        }
    }

    render() {
        console.log("Rendering App");
        const facility = getSelectedFacility();
        let tenant = getSelectedTenant();
        let {state} = this.props;
        return (facility && tenant) ?
            <RouteHandler facility={facility} tenant={tenant} state={state}/>
            :
            <span>Retrieving Facilities...</span>;
    }
};

export default exposeRouter(App);
