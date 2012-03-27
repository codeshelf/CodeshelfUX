/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.3 2012/03/27 06:22:45 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.domainobjects');

codeshelf.domainobjects = {

	organization:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Organization',
		properties:{
			domainId:   {
				id:   'DomainId',
				title:'Organization ID',
				width:25
			},
			description:{
				id:   'Description',
				title:'Description',
				width:100
			}
		}
	},

	facility:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Facility',
		properties:{
			domainId:   {
				id:   'DomainId',
				title:'Organization ID',
				width:25
			},
			description:{
				id:   'Description',
				title:'Description',
				width:100
			}
		}
	},

	digg:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Facility',
		properties:{
			index:   {
				id:   'index',
				title:'index',
				width:25
			},
			diggs:   {
				id:   'diggs',
				title:'diggs',
				width:25
			},
			description:{
				id:   'description',
				title:'description',
				width:300
			}
		}
	}
}
