/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.5 2012/04/01 00:24:35 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.domainobjects');

codeshelf.domainobjects = {

	organization:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Organization',
		properties:{
			domainId:   {
				id:   'DomainId',
				title:'ID',
				width:25
			},
			description:{
				id:   'Description',
				title:'Organization Name',
				width:100
			}
		}
	},

	facility:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Facility',
		properties:{
			domainId:   {
				id:   'DomainId',
				title:'ID',
				width:25
			},
			description:{
				id:   'Description',
				title:'Facility Name',
				width:100
			}
		}
	},

	digg:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Facility',
		properties:{
			index:   {
				id:   'id',
				title:'id',
				width:25
			},
			diggs:   {
				id:   'num',
				title:'num',
				width:25
			},
			description:{
				id:   'title',
				title:'title',
				width:300
			}
		}
	}
}
