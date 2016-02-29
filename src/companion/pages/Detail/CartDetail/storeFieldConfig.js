export const detailFieldsSetting = {
  order: ["domainId", "deviceGuid", "color", "processMode", "cheLighting", "lastScannedLocation", "description", "lastContactTime",  "scannerType"],
  visibility: {
    "domainId":true,
    "className":false,
    "deviceGuid":true,
    "description": true,
    "cheLighting": true,
    "lastBatteryLevel": false,
    "lastContactTime": false,
    "color": true,
    "lastScannedLocation": true,
    "networkAddress": false,
    "networkDeviceStatus": false,
    "processMode": true,
    "scannerType": true,
  },
};

export const historyFieldsSetting = {
  order: ["createdAt", "type", "itemId", "orderId", "workerId+workerName", "-", "itemUom", "itemDescription", "itemLocation", "wiPlanQuantity", "wiActualQuantity"],
  visibility: {
    "type": true,
    "itemId": true,
    "itemUom": true,
    "itemDescription": true,
    "itemLocation": true,
    "wiPlanQuantity": true,
    "wiActualQuantity": true,
    "orderId": true,
    "deviceName+deviceGuid": true,
    "createdAt": true,
    "workerId": false,
    "workerId+workerName": true,

  },
};


export const plannedFieldsSetting = {
  order: ["type", "status", "containerId", "itemId", "description", "-", "planMinQuantity", "locationId", "created", "started"],
  visibility: {
    "type": true,
    "status": true,
    "containerId": true,
    "itemId": true,
    "description": true,
    "pickInstruction": true,
    "planQuantity": true,
    "planMinQuantity": true,
    "planMaxQuantity": true,
    "actualQuantity": true,
    "locationId": true,
    "pickerId": true,
    "posAlongPath": true,
    "created": true,
    "assigned": true,
    "started": true,
    "completed": true,
    "needsScan": true,
    "gtin": true,
    "purpose": true,
    "pathName": true,
    "substituteAllowed": true,
    "substitution": true,
    "alreadyShorted": true,
  },
};


