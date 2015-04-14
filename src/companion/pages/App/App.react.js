import DocumentTitle from 'react-document-title';
import React from 'react';
import {Link, RouteHandler} from 'react-router';
import {selectFirstFacility, selectFacilityByName} from 'data/facilities/actions';
import {getSelectedFacility} from 'data/facilities/store';
import {isLoggedIn} from 'data/user/store';
import exposeRouter from 'components/common/exposerouter';

class App extends React.Component {

    componentWillMount() {
        this.handleRouting(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleRouting(nextProps);
    }

    handleRouting(props) {
        var router = props.router;
        var currentPath = router.getCurrentPath();
        var params = router.getCurrentParams();
        var facilityName = params.facilityName;
        const facility = getSelectedFacility();
        if (!isLoggedIn()) {
            var nextPath = currentPath;
            console.log("not authenticated to reach " + nextPath);
            router.transitionTo("login", {}, {nextPath: nextPath});
        } else if (facilityName != null) {
            if (!facility || (facility && facility.domainId !== facilityName)) {
                selectFacilityByName(facilityName);
            }
        } else {
            if (facility != null) {
                router.transitionTo("facility", {facilityName: facility.domainId});
            } else {
                selectFirstFacility();
            }
        }
    }

    render() {
        console.log("Rendering App");
        const facility = getSelectedFacility();
        return (facility) ?
            <RouteHandler />
            :
            <span>Retrieving Facilities...</span>;
    }
};

export default exposeRouter(App);
