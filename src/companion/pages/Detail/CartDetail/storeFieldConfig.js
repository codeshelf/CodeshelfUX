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
