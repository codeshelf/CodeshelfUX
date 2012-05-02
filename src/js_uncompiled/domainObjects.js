/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.9 2012/05/02 10:21:52 jeffw Exp $
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
			desc: {
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
			desc: {
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