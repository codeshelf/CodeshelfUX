export const headerFieldsSetting = {
  order: ["domainId", "persistentId", "active", "-", "firstName", "lastName", "middleInitial", "groupName", "hrId", "updated", "lastLogin", "lastLogout", "lastChePersistentId", "badgeUnique", "className"],
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
    "lastChePersistentId": true,
    "badgeUnique": true,
    "className": true
  },
};

export const historyFieldsSetting = {
  order: ["persistentId", "type", "itemId", "-", "itemUom", "itemDescription", "itemLocation", "wiPlanQuantity", "wiActualQuantity", "workerName", "orderId", "deviceGuid", "createdAt", "devicePersistentId", "workerId", "orderDetailId", "workInstructionId", "resolved", "resolvedAt", "resolvedBy"],
  visibility: {
    "persistentId": true,
    "type": true,
    "itemId": true,
    "itemUom": true,
    "itemDescription": true,
    "itemLocation": true,
    "wiPlanQuantity": true,
    "wiActualQuantity": true,
    "workerName": true,
    "orderId": true,
    "deviceGuid": true,
    "createdAt": true,
    "devicePersistentId": true,
    "workerId": true,
    "orderDetailId": true,
    "workInstructionId": true,
    "resolved": true,
    "resolvedAt": true,
    "resolvedBy": true,
  },
};
