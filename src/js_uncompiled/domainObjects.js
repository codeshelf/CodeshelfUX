/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: domainObjects.js,v 1.11 2012/07/29 03:27:06 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.domainobjects');

codeshelf.domainobjects = {

	organization: {
		classname:  'Organization',
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
		classname:  'Facility',
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
		classname:  'Location',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	vertex: {
		classname:  'Vertex',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	aisle: {
		classname:  'Aisle',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	}
}