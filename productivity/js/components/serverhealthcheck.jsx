
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
		var HealthChecks = server.healthchecks.map(function(healthcheck) {
			return renderHealthCheck(healthcheck);
		});


		var roles = server.roles;
		var Role = null;
		if (roles.indexOf('appserver')>=0) {
			Role = (<span className="label labelAppserver pull-right">App Server</span>);
		} else if (roles.indexOf('elasticsearch')>=0) {
		   Role = (<span className="label labelElasticsearch pull-right">Elastic Search</span>);
        } else if (roles.indexOf('sitecontroller')>=0) {
		   Role = (<span className="label labelSitecontroller pull-right">Site Controller</span>);
        }

		return (
			<IBox>
				<IBoxTitleBar>
					<IBoxTitleText>
						<span className="hostName">{server.host}</span>
						<span className="hostDescription" >&nbsp;&nbsp;-&nbsp;&nbsp;{server.description}</span>
					</IBoxTitleText>
			        {Role}
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
							{HealthChecks}
						</tbody>
					</table>
					<div className="alert alert-danger">{server.error}</div>
				</IBoxSection>
			</IBox>
		);
	}
});

function renderStatus(healthcheck) {
	var status = healthcheck.status;
	if (status == 'ok') {
		return <span><i className="fa fa-check-circle healthOk"/></span>
	} else if (status == 'fail') {
		return <span><i className="fa fa-warning healthFail"/> &nbsp;&nbsp;{status}</span>
    }
}

function renderHealthCheck(healthcheck) {
	return (
		<tr className="gradeX">
			<td>{healthcheck.name}</td>
			<td>
				{renderStatus(healthcheck)}
			</td>
			<td>{healthcheck.message}</td>
		</tr>);
}

module.exports = ServerHealth
