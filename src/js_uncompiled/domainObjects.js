/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: domainObjects.js,v 1.39 2013/05/26 21:52:20 jeffw Exp $
 ******************************************************************************/

goog.provide('domainobjects');
goog.require('codeshelf.dateformat');
goog.require('goog.string');

codeshelf.toLocationDescription = function(location) {
	var primaryAliasId = location['primaryAliasId'];
	if (goog.string.isEmpty(primaryAliasId)) {
		return location['nominalLocationId'];
	} else {
		return primaryAliasId;
	}
};

function timestampFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null) {
		return "";
	} else {
        return '<span title="' + codeshelf.toJSDate(value) + '">' + codeshelf.conciseDateTimeFormat(value) + '</span>';
    }
}

function metersFormatter(row, cell, value, columnDef, dataContext) {
	if (value == null) {
		return "";
	}
	return value.toFixed(2);
}

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
			'ledChannelUi': {
				'id':    'ledChannelUi',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerIdUi': {
				'id':    'ledControllerIdUi',
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
			'locationWidthUi': {
				'id':    'locationWidthUi',
				'title': 'Loc. Width Meters',
				'width': 15
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
			},
			'verticesUi': {
				'id': 'verticesUi',
				'title': 'Vertices',
				'width': 40
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'tapeId': {
				'id': 'tapeId',
				'title': 'Tape Id',
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
			'metersFromLeft': {
				'id':    'metersFromLeft',
				'title': 'Meters From Left',
				'width': 15
			},
			'locationWidthUi': {
				'id':    'locationWidthUi',
				'title': 'Loc. Width Meters',
				'width': 15
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
			},
			'verticesUi': {
				'id': 'verticesUi',
				'title': 'Vertices',
				'width': 40
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'tapeId': {
				'id': 'tapeId',
				'title': 'Tape Id',
				'width': 40
			},
			'ledChannelUi': {
				'id':    'ledChannelUi',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerIdUi': {
				'id':    'ledControllerIdUi',
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
			'posconIndex': {
				'id':    'posconIndex',
				'title': 'Poscon',
				'width': 8
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
			'color': {
				'id': 'color',
				'title': 'Color',
				'width': 16
			},
			'worker': {
				'id': 'workerUi',
				'title': 'Worker',
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
			},
	        'processMode': {
                'id': 'processMode',
                'title': 'Process Mode',
                'width': 12
            },
			'activePathUi': {
				'id': 'activePathUi',
				'title': 'Path',
				'width': 16
			},
			'lastScannedLocation': {
				'id': 'lastScannedLocation',
				'title': 'Loc Scan',
				'width': 16
			},
			'associateToUi': {
				'id': 'associateToUi',
				'title': 'Associated CHE',
				'width': 16
			},
			'scannerType': {
				'id': 'scannerType',
				'title': 'Scanner Type',
				'width': 16
			},
			'cheLighting': {
				'id': 'cheLighting',
				'title': 'Lighting Type',
				'width': 16
			}
		}
	},
	
	'CodeshelfNetwork': {
		'className':  'CodeshelfNetwork',
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
			'posconIndex':     {
				'id':    'posconIndex',
				'title': 'Poscon',
				'width': 8
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

	'DomainObjectProperty': {
		'className':  'FacilityProperty',
		'properties': {
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'name': {
				'id':    'name',
				'title': 'Name',
				'width': 10
			},
			'value':     {
				'id':    'value',
				'title': 'Value',
				'width': 10
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 40
			},
			// not so much a UI field, as we need the persistent ID for the feature to show all WIs for this item
			'defaultValue': {
				'id':    'defaultValue',
				'title': 'Default Value',
				'width': 25
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
			'documentState': {
				'id':    'documentState',
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
			},
			'primaryChannel': {
				'id':    'primaryChannel',
				'title': 'Primary Radio Channel',
				'width': 10
			},
			'primarySiteControllerId': {
				'id':    'primarySiteControllerId',
				'title': 'Primary Site Controller Serial Number',
				'width': 10
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
			itemLocationName: {
				'id':    'itemLocationName',
				'title': 'Location',
				'width': 10,
				'editor' : Slick.Editors.Text,
				'focusable': true
			},
			itemCmFromLeft: {
				'id':    'cmFromLeftui',
				'title': 'CM From Left',
				'width': 10,
				'editor': Slick.Editors.Text,
				'focusable': true
			},
			'uomMasterId':         {
				'id':    'uomMasterId',
				'title': 'UOM',
				'width': 5
			},
			'litLedsForItem':         {
				'id':    'litLedsForItem',
				'title': 'LEDs',
				'width': 8
			},
			'metersFromAnchor': {
				'id':    'metersFromAnchor',
				'title': 'Meters From Anchor',
				'width': 10
			},
			gtinId: {
				'id':		'gtinId',
				'title':	'GTIN',
			    'width':	10,
                'comparer': goog.string.caseInsensitiveCompare
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
			},
			itemGtins: {
				'id':		'itemGtins',
				'title':	'Item GTINs',
				'width':	20
			}
		}
	},

	'Gtin': {
		'className':  'Gtin',
		'properties': {
			'domainId': {
				'id': 'gtinUi',
				'title': 'GTIN/UPC',
				'width': 25,
				'editor' : Slick.Editors.Text,
			    'focusable': true,
                'comparer': goog.string.caseInsensitiveCompare
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'itemMasterPersistentId': {
				'id': 'itemMasterPersistentId',
				'title': 'ItemMasterPersistentId',
				'width': 40
			},
			'itemMasterId': {
				'id': 'itemMasterId',
				'title': 'SKU',
				'width': 25
			},
			itemDescription: {
				'id':    'itemDescription',
				'title': 'Description',
				'width': 10
			},
			'uomMasterId':         {
				'id':    'uomMasterId',
				'title': 'UOM',
				'width': 5
			},
			'gtinLocations':         {
				'id':    'gtinLocations',
				'title': 'Item Locations',
				'width': 20
			},
			'uomMasterPersistentId':         {
				'id':    'uomMasterPersistentId',
				'title': 'UOM PersistentId',
				'width': 40
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
			},
			'deviceType': {
				'id': 'deviceType',
				'title': 'Device Type',
				'width': 12
			}
		}
	},

	'LocationAlias': {
		'className':  'LocationAlias',
		'properties': {
			'domainId': {
				'id': 'domainId',
				'title': 'locationAlias',
				'width': 10
			},
			'persistentId': {
				'id': 'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'nominalLocationId': {
				'id': 'nominalLocationId',
				'title': 'mappedLocationId',
				'width': 16
			},
			'updated': {
				'id': 'updated',
				'title': 'Time Updated',
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
			'shipperId': {
				'id': 'shipperId',
				'title': 'Shipper',
				'width': 15
			},
			'customerId':   {
				'id':    'customerId',
				'title': 'Customer',
				'width': 15
			},
			'destinationId':   {
				'id':    'destinationId',
				'title': 'Destination',
				'width': 15
			},
			'willProduceWiUi':    {
				'id':    'willProduceWiUi',
				'title': 'OK',
				'width': 5
			},
			'status':      {
				'id':    'status',
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
			'itemLocations':         {
				'id':    'itemLocations',
				'title': 'Item Locations',
				'width': 15
			},
			'preferredLocationUi':         {
				'id':    'preferredLocationUi',
				'title': 'Pick Location',
				'width': 15
			},
			'preferredNominalUi':         {
				'id':    'preferredNominalUi',
				'title': 'Pick Nominal Location',
				'width': 15
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
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'groupUi': {
				'id':    'groupUi',
				'title': 'Order Group',
				'width': 10
			},
			'workSequence': {
				'id':    'workSequence',
				'title': 'Work Seq',
				'width': 10
			},
			'gtinId': {
				'id':	 'gtinId',
				'title': 'GTIN',
			    'width': 10,
                'comparer': goog.string.caseInsensitiveCompare
			},
			'needsScan': {
				'id':	 'needsScan',
				'title': 'Needs Scan',
				'width': 10
			},
			'orderLocationAliasIds': {
				'id':    'orderLocationAliasIds',
				'title': 'Order Location',
				'width': 10
			},
			'orderType': {
				'id':    'parentOrderType',
				'title': 'Order Type',
				'width': 10
			},
			'orderType': {
				'id':    'substituteAllowed',
				'title': 'Substitute Allowed',
				'width': 10
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
			'status':       {
				'id':    'status',
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
				'title': 'Group Seq',
				'width': 10
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
			'status':       {
				'id':    'status',
				'title': 'Status',
				'width': 15
			},
			'containerId':  {
				'id':    'containerId',
				'title': 'Container ID',
				'width': 15
			},
			'shipperId': {
				'id': 'shipperId',
				'title': 'Shipper',
				'width': 15
			},
			'customerId':   {
				'id':    'customerId',
				'title': 'Customer',
				'width': 15
			},
			'destinationId':   {
				'id':    'destination Id',
				'title': 'Destination',
				'width': 15
			},
			'orderLocationAliasIds': {
				'id':    'orderLocationAliasIds',
				'title': 'Order Location',
				'width': 10
			},
			'active': {
				'id':    'active',
				'title': 'Active',
				'width': 8
			},
			'orderType': {
				'id':    'orderType',
				'title': 'Order Type',
				'width': 10
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'groupUi': {
				'id':    'groupUi',
				'title': 'Order Group',
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
			},
			'pathScript': {
				'id':    'pathScript',
				'title': 'Path Script',
				'width': 100
			},
			'pathName': {
				'id': 'pathNameUi',
				'title': 'Path Name',
				'width': 20,
				'editor': Slick.Editors.Text,
				'focusable': true
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
			},
			'startPosX': {
				'id':    'startPosX',
				'title': 'Start X',
				'width': 8,
				'formatter': metersFormatter
			},
			'startPosY': {
				'id':    'startPosY',
				'title': 'Start Y',
				'width': 8,
				'formatter': metersFormatter

			},
			'endPosX': {
				'id':    'endPosX',
				'title': 'End X',
				'width': 8,
				'formatter': metersFormatter

			},
			'endPosY': {
				'id':    'endPosY',
				'title': 'End Y',
				'width': 8,
				'formatter': metersFormatter
			}

		}
	},
	

	'SiteController': {
		'className':  'SiteController',
		'properties': {
			'domainId': {
				'id':    'domainId',
				'title': 'ID',
				'width': 25
			},
			'userExists': {
				'id':    'userExists',
				'title': 'User Exists',
				'width': 25
			},
			'persistentId': {
				'id':    'persistentId',
				'title': 'Persistent ID',
				'width': 40
			},
			'location': {
				'id':    'location',
				'title': 'Location',
				'width': 8
			},
			'roleUi': {
				'id': 'roleUi',
				'title': 'Role',
				'width': 8
			},
			'networkDomainId': {
				'id':    'networkDomainId',
				'title': 'Network',
				'width': 8
			},
			'channelUi': {
				'id':    'channelUi',
				'title': 'Channel',
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
			'ledChannelUi': {
				'id':    'ledChannelUi',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerIdUi': {
				'id':    'ledControllerIdUi',
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
			'posconIndex': {
				'id':    'posconIndex',
				'title': 'Poscon',
				'width': 8
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
			'metersFromLeft': {
				'id':    'metersFromLeft',
				'title': 'Meters From Left',
				'width': 15
			},
			'locationWidthUi': {
				'id':    'locationWidthUi',
				'title': 'Loc. Width Meters',
				'width': 15
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
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'tapeId': {
				'id': 'tapeId',
				'title': 'Tape Id',
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
			'ledChannelUi': {
				'id':    'ledChannelUi',
				'title': 'Channel',
				'width': 8
			},
			'ledControllerIdUi': {
				'id':    'ledControllerIdUi',
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
				'title': 'Alias Range',
				'width': 10
			},
			'slotPosconRange': {
				'id':    'slotPosconRange',
				'title': 'Poscon Range',
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
			'metersFromLeft': {
				'id':    'metersFromLeft',
				'title': 'Meters From Left',
				'width': 15
			},
			'locationWidthUi': {
				'id':    'locationWidthUi',
				'title': 'Loc. Width Meters',
				'width': 15
			},
			'primaryAliasId': {
				'id':    'primaryAliasId',
				'title': 'Alias',
				'width': 10
			},
			'wall': {
				'id': 'wallUi',
				'title': 'Wall',
				'width': 40
			},
			'tapeIdUi': {
				'id': 'tapeIdUi',
				'title': 'Tape Id',
				'width': 20,
				'editor': Slick.Editors.Text,
				'focusable': true
			},
			'tapeId': {
				'id': 'tapeId',
				'title': 'Tape digits Id',
				'width': 20
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
			'assigned': {
				'id':    'assigned',
				'title': 'Assign',
				'width': 8,
                'formatter': timestampFormatter
			},
			'completed': {
				'id':    'completed',
				'title': 'Complete',
				'width': 8,
                'formatter': timestampFormatter
			},
			'pickInstructionUi': {
				'id':    'pickInstructionUi',
				'title': 'Where',
				'width': 10
			},
			'nominalLocationId': {
				'id':    'nominalLocationId',
				'title': 'Nominal Location',
				'width': 12
			},
			'wiPosAlongPath': {
				'id':    'wiPosAlongPath',
				'title': 'Meters Along Path',
				'width': 10
			},
			'description': {
				'id':    'description',
				'title': 'Description',
				'width': 50
			},
			'itemMasterId': {
				'id': 'itemMasterId',
				'title': 'SKU',
				'width': 25
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
			'status': {
				'id':    'status',
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
			},
			'litLedsForWi':	{
				'id':    'litLedsForWi',
				'title': 'LEDs',
				'width': 8
			},
			'gtinId': {
				'id':	'gtinId',
				'title': 'GTIN',
				'width': 10
			},
			'workSequenceUi': {
				'id':    'workSequenceUi',
				'title': 'Work Seq',
				'width': 10
			},
			'needsScan': {
				'id':	 'needsScan',
				'title': 'Needs Scan',
				'width': 10
			},
			'substituteAllowed': {
				'id':    'substituteAllowed',
				'title': 'Substitute Allowed',
				'width': 10
			},
			'substitution': {
				'id':    'substitution',
				'title': 'Substitution',
				'width': 10
			}
		}
	}
};
