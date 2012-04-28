/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.7 2012/04/28 00:38:44 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.domainobjects');

codeshelf.domainobjects = {

	organization: {
		classname:  'com.gadgetworks.codeshelf.model.persist.Organization',
		properties: {
			domainId:    {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			description: {
				id:    'Description',
				title: 'Organization Name',
				width: 100
			}
		}
	},

	facility: {
		classname:  'com.gadgetworks.codeshelf.model.persist.Facility',
		properties: {
			domainId:    {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			description: {
				id:    'Description',
				title: 'Facility Name',
				width: 100
			}
		}
	},

	location: {
		classname:  'com.gadgetworks.codeshelf.model.persist.Location',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	vertex: {
		classname:  'com.gadgetworks.codeshelf.model.persist.Vertex',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	}
}
