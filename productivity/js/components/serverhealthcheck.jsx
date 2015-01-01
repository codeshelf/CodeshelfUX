var _ = require('lodash');
var React = require("react");

var ibox = require('./ibox');
var IBox = ibox.IBox;
var IBoxTitleBar  = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;

var ServerHealth =  React.createClass({
        render: function() {
                var server = this.props.server;
                var error = this.props.error;
                var healthchecks = this.props.healthchecks;
                var roles = server.roles;

                return (
                        <IBox>
                          <IBoxTitleBar>
                            <IBoxTitleText>
                              <span className="hostName">{server.host}</span>
                              <span className="hostDescription" >&nbsp;&nbsp;-&nbsp;&nbsp;{server.description}</span>
                            </IBoxTitleText>
                                {renderRole(roles)}
                                </IBoxTitleBar>
                                <IBoxSection>
                                        <table className="table table-striped table-bordered table-hover dataTables-example">
                                                <thead>
                                                        <tr>
                                                                <th className="sorting">Health Check</th>
                                                                <th>Status</th>
                                                                <th>Summary</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                         healthchecks.map(function(healthcheck) {
                                                                 return (<tr className="gradeX">
                                                                                   <td>{healthcheck.name}</td>
                                                                                   <td>{renderStatus(healthcheck)}</td>
                                                                           <td>{healthcheck.message}</td>
                                                                         </tr>);
                                                         })
                                                         }
                                                </tbody>
                                        </table>
                                        {(error) ? <div className="alert alert-danger">{error}</div> : '' }
                                </IBoxSection>
                        </IBox>
                );
        }
});

function renderRole(roles) {
        var Role = null;
        if (roles.indexOf('appserver')>=0) {
                Role = (<span className="label labelAppserver pull-right">App Server</span>);
        } else if (roles.indexOf('elasticsearch')>=0) {
                Role = (<span className="label labelElasticsearch pull-right">Elastic Search</span>);
    } else if (roles.indexOf('sitecontroller')>=0) {
                Role = (<span className="label labelSitecontroller pull-right">Site Controller</span>);
    }
        return Role;
}

function renderStatus(healthcheck) {
        var status = healthcheck.status;
        if (status == 'ok') {
                return <span><i className="fa fa-check-circle healthOk"/></span>
        } else if (status == 'fail') {
                return <span><i className="fa fa-warning healthFail"/> &nbsp;&nbsp;{status}</span>
    }
}

module.exports = ServerHealth
