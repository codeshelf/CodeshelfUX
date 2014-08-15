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
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'anchorPosXui': {
				'id':    'anchorPosXui',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosYui': {
				'id':    'anchorPosYui',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosXui': {
				'id':    'pickFaceEndPosXui',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosYui: {
				'id':    'pickFaceEndPosYui',
				'title': 'Pick End Y',
				'width': 40
			},
			nominalLocationId: {
				'id':    'nominalLocationId',
				'title': 'Nominal ID',
				'width': 10
			},
			posAlongPathui: {
				'id':    'posAlongPathui',
				'title': 'Meters Along Path',
				'width': 10
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
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
			'anchorPosXui': {
				'id':    'anchorPosXui',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosYui': {
				'id':    'anchorPosYui',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosXui': {
				'id':    'pickFaceEndPosXui',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosYui: {
				'id':    'pickFaceEndPosYui',
				'title': 'Pick End Y',
				'width': 40
			},
			nominalLocationId: {
				'id':    'nominalLocationId',
				'title': 'Nominal ID',
				'width': 10
			},
			posAlongPathui: {
				'id':    'posAlongPathui',
				'title': 'Meters Along Path',
				'width': 10
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
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
			'deviceGuidStr': {
				'id': 'deviceGuidStr',
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
			},
			'activeContainers': {
				'id': 'activeContainers',
				'title': 'Containers',
				'width': 40
			}
		}
	},

	'ContainerUse': {
		'className':  'ContainerUse',
		'properties': {
			'domainId':         {
				'id':    'domainId',
				'title': 'Domain ID',
				'width': 30
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'cheName':     {
				'id':    'cheName',
				'title': 'CHE',
				'width': 10
			},
			'containerName': {
				'id':    'containerName',
				'title': 'Container',
				'width': 10
			},
			'orderName':     {
				'id':    'orderName',
				'title': 'Order',
				'width': 10
			},
			'itemInCntrDescription': {
				'id':    'itemInCntrDescription',
				'title': 'First Item Description',
				'width': 40
			},
			'itemInCntrSku': {
				'id':    'itemInCntrSku',
				'title': 'First Item SKU',
				'width': 25
			},
			// not so much a UI field, as we need the persistent ID for the feature to show all WIs for this item
			'itemInCntrPersistentId': {
				'id':    'itemInCntrPersistentId',
				'title': 'Item Master PersistentId',
				'width': 25
			},
			'active': {
				'id':    'active',
				'title': 'Active',
				'width': 8
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
		}
	},

	'Item': {
		'className':  'Item',
		'properties': {
			'domainId': {
				'id': 'domainId',
				'title': 'Id',
				'width': 25
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'itemMasterId': {
				'id': 'itemMasterId',
				'title': 'SKU',
				'width': 25
			},
			nominalLocationId: {
				'id':    'nominalLocationId',
				'title': 'Nominal Location',
				'width': 16
			},
			itemDescription: {
				'id':    'itemDescription',
				'title': 'Description',
				'width': 10
			},
			itemQuantityUom: {
				'id':    'itemQuantityUom',
				'title': 'Quantity',
				'width': 10
			},
			posAlongPathui: {
				'id':    'posAlongPathui',
				'title': 'Meters Along Path',
				'width': 10
			},
			itemTier: {
				'id':    'itemTier',
				'title': 'Tier',
				'width': 6
			},
			itemLocationAlias: {
				'id':    'itemLocationAlias',
				'title': 'Location',
				'width': 10,
				'editor' : Slick.Editors.Text,
				'focusable': true
			},
			itemCmFromLeft: {
				'id':    'itemCmFromLeft',
				'title': 'CM From Left',
				'width': 10,
				'editor': Slick.Editors.Text,
				'focusable': true
			}
		}
	},

	'ItemMaster': {
		'className':  'ItemMaster',
		'properties': {
			'domainId': {
				'id': 'domainId',
				'title': 'SKU',
				'width': 25
			},
			description: {
				'id':    'description',
				'title': 'Description',
				'width': 40
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			slotFlexId: {
				'id':    'slotFlexId',
				'title': 'slotFlexId',
				'width': 10
			},
			active: {
				'id':    'active',
				'title': 'Active',
				'width': 6
			},
			itemLocations: {
				'id':    'itemLocations',
				'title': 'Item Locations',
				'width': 10
			}
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
			'deviceGuidStr': {
				'id': 'deviceGuidStr',
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
			},
			'wiLocation': {
				'id':    'wiLocation',
				'title': 'WI Location',
				'width': 10
			},
			'wiChe': {
				'id':    'wiChe',
				'title': 'WI CHE',
				'width': 6
			},
			'active': {
				'id':    'active',
				'title': 'Active',
				'width': 8
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
			},
			'active': {
				'id':    'active',
				'title': 'Active',
				'width': 8
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
				'width': 25
			},
			'description':  {
				'id':    'description',
				'title': 'Description',
				'width': 50
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
			},
			'orderLocationAliasIds': {
				'id':    'orderLocationAliasIds',
				'title': 'Location',
				'width': 10
			},
			'active': {
				'id':    'active',
				'title': 'Active',
				'width': 8
			},
			'orderTypeEnum': {
				'id':    'orderTypeEnum',
				'title': 'Order Type',
				'width': 10
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
			},
			'associatedLocationCount': {
				'id':    'associatedLocationCount',
				'title': 'Locations',
				'width': 8
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
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
			},
			'associatedLocationCount': {
				'id':    'associatedLocationCount',
				'title': 'Locations',
				'width': 8
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
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
			},
			nominalLocationId: {
				'id':    'nominalLocationId',
				'title': 'Nominal ID',
				'width': 10
			},
			posAlongPathui: {
				'id':    'posAlongPathui',
				'title': 'Meters Along Path',
				'width': 10
			},
			'anchorPosXui': {
				'id':    'anchorPosXui',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosYui': {
				'id':    'anchorPosYui',
				'title': 'Anchor Y',
				'width': 40
			},
			pickFaceEndPosXui: {
				'id':    'pickFaceEndPosXui',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosYui: {
				'id':    'pickFaceEndPosYui',
				'title': 'Pick End Y',
				'width': 40
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
			'baySortName': {
				'id':    'baySortName',
				'title': 'Bay Sort',
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
			'anchorPosXui': {
				'id':    'anchorPosXui',
				'title': 'Anchor X',
				'width': 40
			},
			'anchorPosYui': {
				'id':    'anchorPosYui',
				'title': 'Anchor Y',
				'width': 40
			},
			'pickFaceEndPosXui': {
				'id':    'pickFaceEndPosXui',
				'title': 'Pick End X',
				'width': 40
			},
			pickFaceEndPosYui: {
				'id':    'pickFaceEndPosYui',
				'title': 'Pick End Y',
				'width': 40
			},
			'slotAliasRange': {
				'id':    'slotAliasRange',
				'title': 'Slot Aliases',
				'width': 10
			},
			'nominalLocationId': {
				'id':    'nominalLocationId',
				'title': 'Nominal ID',
				'width': 10
			},
			posAlongPathui: {
				'id':    'posAlongPathui',
				'title': 'Meters Along Path',
				'width': 10
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
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
		// let's default to sort,where,description, quantity,container,Che
		'className':  'WorkInstruction',
		'properties': {
			'groupAndSortCode': {
				'id':    'groupAndSortCode',
				'title': 'Sort',
				'width': 6
			},
			'completeTimeForUi': {
				'id':    'completeTimeForUi',
				'title': 'Complete',
				'width': 8
			},
			'pickInstruction': {
				'id':    'pickInstruction',
				'title': 'Where',
				'width': 10
			},
			'nominalLocationId': {
				'id':    'nominalLocationId',
				'title': 'Nominal Location',
				'width': 12
			},
			wiPosAlongPath: {
				'id':    'wiPosAlongPath',
				'title': 'Meters Along Path',
				'width': 10
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 50
			},
			'planQuantity': {
				'id':    'planQuantity',
				'title': 'Quant.',
				'width': 6
			},
			'uomMasterId': {
				'id':    'uomMasterId',
				'title': 'UOM',
				'width': 3
			},
			'orderId': {
				'id':    'orderId',
				'title': 'for Order',
				'width': 15
			},
			'orderDetailId': {
				'id':    'orderDetailId',
				'title': 'for Order Detail',
				'width': 15
			},
			'containerId': {
				'id':    'containerId',
				'title': 'Container',
				'width': 10
			},
			'assignedCheName': {
				'id':    'assignedCheName',
				'title': 'CHE',
				'width': 6
			},
			'domainId':    {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'statusEnum': {
				'id':    'statusEnum',
				'title': 'Status',
				'width': 10
			},
			'planMinQuantity': {
				'id':    'planMinQuantity',
				'title': 'Min.',
				'width': 6
			},
			'planMaxQuantity': {
				'id':    'planMaxQuantity',
				'title': 'Max.',
				'width': 6
			},
			'actualQuantity': {
				'id':    'actualQuantity',
				'title': 'Actual',
				'width': 6
			}
		}
	}
};
