/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.39 2013/05/26 21:52:20 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');

domainobjects = {

	'Aisle': {
		'className':  'Aisle',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'pathSegId': {
				'id':    'pathSegId',
				'title': 'Path Segment',
				'width': 25
			},
			'ledControllerId': {
				'id':    'ledControllerId',
				'title': 'Controller',
				'width': 25
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'anchorPosX': {
				'id':    'anchorPosX',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosY': {
				'id':    'anchorPosY',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosX': {
				'id':    'pickFaceEndPosX',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosY: {
				'id':    'pickFaceEndPosY',
				'title': 'Pick End Y',
				'width': 40
			}
		}
	},

	'Bay': {
		'className':  'Bay',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'baySortName': {
				'id':    'baySortName',
				'title': 'Bay Sort',
				'width': 25
			},
			'ledChannel': {
				'id':    'ledChannel',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerId': {
				'id':    'ledControllerId',
				'title': 'Controller',
				'width': 25
			},
			'anchorPosX': {
				'id':    'anchorPosX',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosY': {
				'id':    'anchorPosY',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosX': {
				'id':    'pickFaceEndPosX',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosY: {
				'id':    'pickFaceEndPosY',
				'title': 'Pick End Y',
				'width': 40
			}
		}
	},

	'Che': {
		'className':  'Che',
		'properties': {
			'domainId': {
				'id': 'domainId',
				'title': 'ID',
				'width': 25
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'deviceGuid': {
				'id': 'deviceGuid',
				'title': 'Device GUID',
				'width': 16
			},
			'currentWorkArea': {
				'id': 'currentWorkArea',
				'title': 'Work Area',
				'width': 16
			},
			'currentUser': {
				'id': 'currentUser',
				'title': 'User',
				'width': 16
			},
			'lastBatteryLevel': {
				'id': 'lastBatteryLevel',
				'title': 'Battery',
				'width': 16
			},
			'description': {
				'id': 'description',
				'title': 'Description',
				'width': 40
			}
		}
	},


	'DropboxService': {
		'className':  'DropboxService',
		'properties': {
			'domainId':         {
				'id':    'domainId',
				'title': 'Parent ID',
				'width': 25
			},
			'providerEnum':     {
				'id':    'providerEnum',
				'title': 'Provider',
				'width': 40
			},
			'serviceStateEnum': {
				'id':    'serviceStateEnum',
				'title': 'Service State',
				'width': 40
			}
		}
	},

	'EdiDocumentLocator': {
		'className':  'EdiDocumentLocator',
		'properties': {
			'domainId':          {
				'id':    'domainId',
				'title': 'Parent ID',
				'width': 25
			},
			'documentStateEnum': {
				'id':    'documentStateEnum',
				'title': 'Doc State',
				'width': 40
			},
			'documentName':      {
				'id':    'documentName',
				'title': 'Document Name',
				'width': 100
			}
		}
	},

	'Facility': {
		'className':  'Facility',
		'properties': {
			'domainId':    {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'description': {
				'id':    'description',
				'title': 'Facility Name',
				'width': 50
			}
//			'providerEnum':     {
//				'id':    'providerEnum',
//				'title': 'Provider',
//				'width': 100
//			},
//			'serviceStateEnum':     {
//				'id':    'serviceStateEnum',
//				'title': 'State',
//				'width': 100
//			},
//			'documentId':     {
//				'id':    'documentId',
//				'title': 'DocumentId',
//				'width': 100
//			},
//			'documentStateEnum':     {
//				'id':    'documentStateEnum',
//				'title': 'State',
//				'width': 100
//			}
		}
	},

	'LedController': {
		'className':  'LedController',
		'properties': {
			'domainId': {
				'id': 'domainId',
				'title': 'ID',
				'width': 25
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'deviceGuid': {
				'id': 'deviceGuid',
				'title': 'Device GUID',
				'width': 16
			}
		}
	},

	'LocationABC': {
		'className':  'Location',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			}
		}
	},

	'OrderDetail': {
		'className':  'OrderDetail',
		'properties': {
			'fullDomainId':    {
				'id':    'fullDomainId',
				'title': 'ID',
				'width': 25
			},
			'orderId':     {
				'id':    'orderId',
				'title': 'Order ID',
				'width': 15
			},
			'orderDetailId':    {
				'id':    'orderDetailId',
				'title': 'Detail ID',
				'width': 15
			},
			'statusEnum':      {
				'id':    'statusEnum',
				'title': 'Status',
				'width': 25
			},
			'itemMasterId':         {
				'id':    'itemMasterId',
				'title': 'SKU',
				'width': 15
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 50
			},
			'quantity':    {
				'id':    'quantity',
				'title': 'Qty',
				'width': 5
			},
			'uomMasterId':         {
				'id':    'uomMasterId',
				'title': 'UOM',
				'width': 5
			}
		}
	},

	'OrderGroup': {
		'className':  'OrderGroup',
		'properties': {
			'fullDomainId':     {
				'id':    'fullDomainId',
				'title': 'ID',
				'width': 25
			},
			'statusEnum':       {
				'id':    'statusEnum',
				'title': 'Status',
				'width': 15
			},
			'description':  {
				'id':    'description',
				'title': 'Description',
				'width': 50
			},
			'workSequence': {
				'id':    'workSequence',
				'title': 'Work Seq',
				'width': 15
			}
		}
	},

	'OrderHeader': {
		'className':  'OrderHeader',
		'properties': {
			'fullDomainId':     {
				'id':    'fullDomainId',
				'title': 'ID',
				'width': 25
			},
			'orderId':      {
				'id':    'orderId',
				'title': 'Order ID',
				'width': 15
			},
			'readableOrderDate':      {
				'id':    'readableOrderDate',
				'title': 'Order Date',
				'width': 15
			},
			'readableDueDate':      {
				'id':    'readableDueDate',
				'title': 'Due Date',
				'width': 15
			},
			'statusEnum':       {
				'id':    'statusEnum',
				'title': 'Status',
				'width': 15
			},
			'containerId':  {
				'id':    'containerId',
				'title': 'Container ID',
				'width': 15
			},
			'shipmentId':   {
				'id':    'shipmentId',
				'title': 'Shipment ID',
				'width': 15
			},
			'customerId':   {
				'id':    'customerId',
				'title': 'Customer ID',
				'width': 15
			},
			'workSequence': {
				'id':    'workSequence',
				'title': 'Work Seq',
				'width': 15
			}
		}
	},

	'Organization': {
		'className':  'Organization',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'desc':     {
				'id':    'description',
				'title': 'Organization Name',
				'width': 100
			}
		}
	},

	'Path': {
		'className':  'Path',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			}
		}
	},

	'PathSegment': {
		'className':  'PathSegment',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'segmentOrder': {
				'id':    'segmentOrder',
				'title': 'Seg. Order',
				'width': 8
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			}
		}
	},

	'Slot': {
		'className':  'Slot',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'firstLedNumAlongPath': {
				'id':    'firstLedNumAlongPath',
				'title': 'First LED',
				'width': 10
			},
			'lastLedNumAlongPath': {
				'id':    'lastLedNumAlongPath',
				'title': 'Last LED',
				'width': 10
			}
		}
	},

	'Tier': {
		'className':  'Tier',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'tierSortName': {
				'id':    'tierSortName',
				'title': 'Tier Sort',
				'width': 25
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'ledChannel': {
				'id':    'ledChannel',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerId': {
				'id':    'ledControllerId',
				'title': 'Controller',
				'width': 25
			},
			'firstLedNumAlongPath': {
				'id':    'firstLedNumAlongPath',
				'title': 'First LED',
				'width': 10
			},
			'lastLedNumAlongPath': {
				'id':    'lastLedNumAlongPath',
				'title': 'Last LED',
				'width': 10
			},
			'anchorPosX': {
				'id':    'anchorPosX',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosY': {
				'id':    'anchorPosY',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosX': {
				'id':    'pickFaceEndPosX',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosY: {
				'id':    'pickFaceEndPosY',
				'title': 'Pick End Y',
				'width': 40
			}
		}
	},
	'Vertex': {
		'className':  'Vertex',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			}
		}
	},

	'WorkArea': {
		'className':  'WorkArea',
		'properties': {
			'domainId':    {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 50
			}
		}
	},

	'WorkInstruction': {
		'className':  'WorkInstruction',
		'properties': {
			'domainId':    {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 50
			}
		}
	}
};
