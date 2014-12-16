
var _ = require('lodash');
var ibox = require('ibox');
var IBox = ibox.IBox;
var IBoxTitleBar  = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;


var server = this.props.server;

function renderHealthCheck(healthcheck) {

}

function renderStatus(status) {
	if (status == 'ok') {
		return <span><i className="fa fa-check-circle healthOk"/></span>
	} else if (status == 'fail') {
		return <span><i className="fa fa-warning healthFail"/> &nbsp;&nbsp;{healthcheck.status}</span>
    }
}



var healthCheck = <tr className="gradeX">
					<td>{healthcheck.name}</td>
					<td>
						rendertStatus(healthcheck.status);
						</td>
					<td>{healthcheck.message}</td>
				</tr>


<IBox>
	<IBoxTitleBar>
		<IBoxTitleText>
			<span className="hostName">{this.props.host}</span>
			<span className="hostDescription" >&nbsp;&nbsp;-&nbsp;&nbsp;{this.props.description}</span>
		</IBoxTitleText>
		<span className="label labelAppserver pull-right" ng-show="server.roles.indexOf('appserver')>=0">App Server</span>
		<span className="label labelElasticsearch pull-right" ng-show="server.roles.indexOf('elasticsearch')>=0">Elastic Search</span>
		<span className="label labelSitecontroller pull-right" ng-show="server.roles.indexOf('sitecontroller')>=0">Site Controller</span>
	</IBoxTitleBar>
	<IBoxSection>
		<table ng-show="server.healthchecks"
			   className="table table-striped table-bordered table-hover dataTables-example">
			<thead>
				<tr>
					<th className="sorting">Health Check</th>
					<th>Status</th>
					<th>Summary</th>
				</tr>
			</thead>
			<tbody>
				<tr className="gradeX" ng:repeat="healthcheck in server.healthchecks">
					<td>{healthcheck.name}</td>
					<td><i className="fa fa-warning healthFail" ng-show="{{healthcheck.status=='fail'}}"/><i className="fa fa-check-circle healthOk" ng-show="{{healthcheck.status=='ok'}}"/>&nbsp;&nbsp;{{healthcheck.status}}</td>
					<td>{{healthcheck.message}}</td>
				</tr>
		</table>

	</IBoxSection>
	<IBoxSection>
		<div className="alert alert-danger" ng-show="server.error">{{server.error}}</div>
	</IBoxSection>
</div>
