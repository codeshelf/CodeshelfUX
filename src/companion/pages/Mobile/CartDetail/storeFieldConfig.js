export const detailFieldsSetting = {
  order: ["domainId", "className", "deviceGuid", "description", "lastBaterryLevel", "lastContactTime", "networkDeviceStatus", "scannerType", "processMode", "color", "cheLighting", "lastScannedLocation", "networkAddress"],
  visibility: {
    "domainId":true,
    "className":true,
    "deviceGuid":true,
    "description": true,
    "cheLighting": true,
    "lastBaterryLevel": true,
    "lastContactTime": true,
    "color": true,
    "lastScannedLocation": true,
    "networkAddress": true,
    "networkDeviceStatus": true,
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
