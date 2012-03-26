/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.1 2012/03/26 22:49:50 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.domainobjects');

codeshelf.domainobjects = {

	organization:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Organization',
		properties:{
			domainId:   ['DomainId', 'Organization ID', 10],
			description:['Description', 'Description', 30]
		}
	},

	facility:{
		classname: 'com.gadgetworks.codeshelf.model.persist.Facility',
		properties:{
			domainId:   ['DomainId', 'Organization ID', 10],
			description:['Description', 'Description', 30]
		}
	}
}
