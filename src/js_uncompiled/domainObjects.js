/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.19 2012/09/18 06:25:00 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');

domainobjects = {

	Organization: {
		className:  'Organization',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			desc:     {
				id:    'Description',
				title: 'Organization Name',
				width: 100
			}
		}
	},

	Facility: {
		className:  'Facility',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'ParentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			desc:     {
				id:    'Description',
				title: 'Facility Name',
				width: 50
			}
//			provider:     {
//				id:    'ProviderEnum',
//				title: 'Provider',
//				width: 100
//			},
//			serviceState:     {
//				id:    'ServiceStateEnum',
//				title: 'State',
//				width: 100
//			},
//			documentId:     {
//				id:    'DocumentId',
//				title: 'DocumentId',
//				width: 100
//			},
//			documentState:     {
//				id:    'DocumentStateEnum',
//				title: 'State',
//				width: 100
//			}
		}
	},

	location: {
		className:  'Location',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Vertex: {
		className:  'Vertex',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Aisle: {
		className:  'Aisle',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Bay: {
		className:  'Bay',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	DropboxService: {
		className:  'DropboxService',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'ParentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			provider:     {
				id:    'ProviderEnum',
				title: 'Provider',
				width: 40
			},
			serviceState:     {
				id:    'ServiceStateEnum',
				title: 'Service State',
				width: 40
			}
		}
	},

	EdiDocumentLocator: {
		className:  'EdiDocumentLocator',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'ParentFullDomainId',
				title: 'ID',
				width: 50
			},
			documentState:     {
				id:    'DocumentStateEnum',
				title: 'Doc State',
				width: 40
			},
			documentName:     {
				id:    'DocumentName',
				title: 'Document Name',
				width: 100
			}
		}
	}

};