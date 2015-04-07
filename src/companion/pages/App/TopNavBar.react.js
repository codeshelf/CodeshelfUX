import React from 'react';
import Icon from 'react-fa';

//TODO show logout if logged in
export default class TopNavBar  extends React.Component {

    render() {
        return (
                <div className="row border-bottom">
                <nav style={{marginBottom: 0}} role="navigation" className="navbar navbar-static-top">
                <div className="navbar-header">
                <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.handleNavbarMinimalize} ><Icon name="bars" /> </a>

                </div>
                <ul className="nav navbar-top-links">
                <li>
                <a href="">{this.props.title}</a>

                </li>
                </ul>
                </nav>

                </div>
        );
    }
};
