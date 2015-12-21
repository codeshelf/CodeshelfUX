import rrb from 'react-router-bootstrap';
import rr from 'react-router';
import {connect} from 'react-redux';


function mapState(state) {
  return {
    facility: state.facility.selectedFacility
  }
}

function wrapFacility(Component) {

  class WrapFacility extends React.Component {
    render() {
      let params = {};
      if (this.props.params) {
        params = {...this.props.params};
      }
      if (!this.props.facility) {
        // no links will be renderd without facility
        return null;
      } else {
        if (!params["facilityName"]) {
          params["facilityName"] = this.props.facility.domainId;
        }
        return <Component {...this.props} params={params} />;
      }
    }
  }

  return connect(mapState)(WrapFacility);
}

export const NavItemLink = wrapFacility(rrb.NavItemLink);
export const MenuItemLink = wrapFacility(rrb.MenuItemLink);
export const ButtonLink = wrapFacility(rrb.ButtonLink);
export const ListGroupItemLink = wrapFacility(rrb.ListGroupItemLink);
export const Link = wrapFacility(rr.Link);
