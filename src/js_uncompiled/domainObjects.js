/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.22 2012/10/05 21:01:38 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');

domainobjects = {

	Organization: {
		className:  'Organization',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			},
			desc:     {
				id:    'description',
				title: 'Organization Name',
				width: 100
			}
		}
	},

	Facility: {
		className:  'Facility',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			desc:     {
				id:    'description',
				title: 'Facility Name',
				width: 50
			}
//			provider:     {
//				id:    'providerEnum',
//				title: 'Provider',
//				width: 100
//			},
//			serviceState:     {
//				id:    'serviceStateEnum',
//				title: 'State',
//				width: 100
//			},
//			documentId:     {
//				id:    'DocumentId',
//				title: 'DocumentId',
//				width: 100
//			},
//			documentState:     {
//				id:    'documentStateEnum',
//				title: 'State',
//				width: 100
//			}
		}
	},

	location: {
		className:  'Location',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Vertex: {
		className:  'Vertex',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Aisle: {
		className:  'Aisle',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Bay: {
		className:  'Bay',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			}
		}
	},

	OrderHeader: {
		className:  'OrderHeader',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			},
			orderId: {
				id:    'orderId',
				title: 'Order ID',
				width: 25
			}
		}
	},

	OrderDetail: {
		className:  'OrderDetail',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'ID',
				width: 25
			},
			detailId: {
				id:    'detailId',
				title: 'Detail ID',
				width: 25
			},
			sku: {
				id:    'sku',
				title: 'SKU',
				width: 25
			},
			description: {
				id:    'description',
				title: 'Description',
				width: 25
			},
			quantity: {
				id:    'quantity',
				title: 'Qty',
				width: 25
			}
		}
	},

	DropboxService: {
		className:  'DropboxService',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			provider:     {
				id:    'providerEnum',
				title: 'Provider',
				width: 40
			},
			serviceState:     {
				id:    'serviceStateEnum',
				title: 'Service State',
				width: 40
			}
		}
	},

	EdiDocumentLocator: {
		className:  'EdiDocumentLocator',
		properties: {
			domainId: {
				id:    'shortDomainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'ID',
				width: 50
			},
			documentState:     {
				id:    'documentStateEnum',
				title: 'Doc State',
				width: 40
			},
			documentName:     {
				id:    'documentName',
				title: 'Document Name',
				width: 100
			}
		}
	}

};