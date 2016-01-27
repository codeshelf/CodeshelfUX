export const headerFieldsSetting = {
  order: ["domainId", "firstName", "lastName", "middleInitial", "groupName", "-", "hrId", "updated", "lastLogin", "lastLogout"],
  visibility: {
    "domainId":true,
    "persistentId":true,
    "active":true,
    "firstName": true,
    "lastName": true,
    "middleInitial": true,
    "groupName": true,
    "hrId": true,
    "updated": true,
    "lastLogin": true,
    "lastLogout": true,
  },
};

export const historyFieldsSetting = {
  order: ["createdAt", "type", "itemId", "deviceName+deviceGuid", "-", "itemUom", "itemDescription", "itemLocation", "wiPlanQuantity", "wiActualQuantity", "orderId"],
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
  },
};
