/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.28 2012/11/08 03:35:10 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');

domainobjects = {

	Aisle: {
		className:  'Aisle',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Bay: {
		className:  'Bay',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	},

	DropboxService: {
		className:  'DropboxService',
		properties: {
			domainId:           {
				id:    'domainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			provider:           {
				id:    'providerEnum',
				title: 'Provider',
				width: 40
			},
			serviceState:       {
				id:    'serviceStateEnum',
				title: 'Service State',
				width: 40
			}
		}
	},

	EdiDocumentLocator: {
		className:  'EdiDocumentLocator',
		properties: {
			domainId:           {
				id:    'fullDomainId',
				title: 'Parent ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'ID',
				width: 50
			},
			documentState:      {
				id:    'documentStateEnum',
				title: 'Doc State',
				width: 40
			},
			documentName:       {
				id:    'documentName',
				title: 'Document Name',
				width: 100
			}
		}
	},

	Facility: {
		className:  'Facility',
		properties: {
			domainId:           {
				id:    'fullDomainId',
				title: 'ID',
				width: 25
			},
			parentFullDomainId: {
				id:    'parentFullDomainId',
				title: 'Parent ID',
				width: 50
			},
			desc:               {
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

	LocationABC: {
		className:  'Location',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	},

	OrderDetail: {
		className:  'OrderDetail',
		properties: {
			domainId:    {
				id:    'fullDomainId',
				title: 'ID',
				width: 25
			},
			detailId:    {
				id:    'domainId',
				title: 'Detail ID',
				width: 15
			},
			status:      {
				id:    'statusEnum',
				title: 'Status',
				width: 25
			},
			sku:         {
				id:    'itemMasterId',
				title: 'SKU',
				width: 20
			},
			description: {
				id:    'description',
				title: 'Description',
				width: 50
			},
			quantity:    {
				id:    'quantity',
				title: 'Qty',
				width: 10
			},
			uom:         {
				id:    'uomMasterId',
				title: 'UOM',
				width: 10
			}
		}
	},

	OrderHeader: {
		className:  'OrderHeader',
		properties: {
			domainId: {
				id:    'fullDomainId',
				title: 'ID',
				width: 25
			},
			orderId:  {
				id:    'orderId',
				title: 'Order ID',
				width: 15
			}
		}
	},

	Organization: {
		className:  'Organization',
		properties: {
			domainId: {
				id:    'domainId',
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

	Path: {
		className:  'Path',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	},

	PathSegment: {
		className:  'PathSegment',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	},

	Vertex: {
		className:  'Vertex',
		properties: {
			domainId: {
				id:    'domainId',
				title: 'ID',
				width: 25
			}
		}
	}
};
