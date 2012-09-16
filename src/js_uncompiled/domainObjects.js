/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.17 2012/09/16 07:22:15 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');

domainobjects = {

	organization: {
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

	facility: {
		className:  'Facility',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			desc:     {
				id:    'Description',
				title: 'Facility Name',
				width: 100
			},
			provider:     {
				id:    'ProviderEnum',
				title: 'Provider',
				width: 100
			},
			documentId:     {
				id:    'DocumentId',
				title: 'DocumentId',
				width: 100
			}
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

	vertex: {
		className:  'Vertex',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	aisle: {
		className:  'Aisle',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	bay: {
		className:  'Bay',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	dropboxservice: {
		className:  'DropboxService',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			provider:     {
				id:    'ProviderEnum',
				title: 'Provider',
				width: 100
			},
			servicestate:     {
				id:    'ServiceStateEnum',
				title: 'State',
				width: 100
			}
		}
	},

	edidocumentlocator: {
		className:  'EdiDocumentLocator',
		properties: {
			domainId: {
				id:    'DomainId',
				title: 'ID',
				width: 25
			},
			provider:     {
				id:    'ProviderEnum',
				title: 'Provider',
				width: 100
			},
			servicestate:     {
				id:    'ServiceStateEnum',
				title: 'State',
				width: 100
			}
		}
	}

};