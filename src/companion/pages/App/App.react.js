import DocumentTitle from 'react-document-title';
import React from 'react';
import {Link, RouteHandler} from 'react-router';
import {fetchFacilities, selectFirstFacility, selectFacilityByName} from 'data/facilities/actions';
import {getSelectedFacility} from 'data/facilities/store';
import {isLoggedIn, getSelectedTenant} from 'data/user/store';
import exposeRouter from 'components/common/exposerouter';


class App extends React.Component {

    componentWillMount() {
        fetchFacilities();
        this.handleRouting(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.handleRouting(nextProps);
    }

    handleRouting(props) {
      const {router, params} = props;
      var facilityName = params.facilityName;
      const facility = getSelectedFacility();
      if (facilityName != null) {
        if (!facility || (facility && facility.domainId !== facilityName)) {
          selectFacilityByName(facilityName);
        }
      } else if (facility != null) {
        router.push(`/facilities/${facility.domainId}`);
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
            React.cloneElement(this.props.children, { state, facility, tenant })
            :
            <span>Retrieving Facilities...</span>;
    }
};

export default exposeRouter(App);
