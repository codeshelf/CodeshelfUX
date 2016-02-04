import {LinkContainer} from 'react-router-bootstrap';
import {Link as rrLink} from 'react-router';
import {NavItem, MenuItem, Button, ListGroupItem} from 'react-bootstrap';
import {connect} from 'react-redux';


function mapState(state) {
  return {
    facility: state.facility.selectedFacility
  }
}

function wrapFacility(Component) {
  console.log("fac comp",Component);

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
        return (<Component {...this.props} params={params} />);
      }
    }
  }

  return connect(mapState)(WrapFacility);
}

function wrapLink(Component) {
  return (props) => {
    return (<LinkContainer {...props}>
                <Component {...props}>
                  {props.children}
                </Component>
            </LinkContainer>);
  }
}

export const NavItemLink = wrapFacility(wrapLink(NavItem));
export const MenuItemLink = wrapFacility(wrapLink(MenuItem));
export const ButtonLink = wrapFacility(wrapLink(Button));
export const ListGroupItemLink = wrapFacility(wrapLink(ListGroupItem));
export const Link = wrapFacility(rrLink);
