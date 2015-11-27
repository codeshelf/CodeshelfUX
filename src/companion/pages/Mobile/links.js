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
      if (this.props.params && this.props.facility) {
        params = {
         ...this.props.params,
         facilityName: this.props.facility.persistentId,
        }
      }
      console.log(params)
      return <Component {...this.props} params={params} />;
    }
  }

  return connect(mapState)(WrapFacility);
}

export const NavItemLink = wrapFacility(rrb.NavItemLink);
export const MenuItemLink = wrapFacility(rrb.MenuItemLink);
export const ButtonLink = wrapFacility(rrb.ButtonLink);
export const Link = wrapFacility(rr.Link);
