export const headerFieldsSetting = {
  order: ["dueDate", "status", "-", "orderDate", "customerId", "containerId", "shipperId", "destinationId", "orderLocationAliasIds", "groupUi",
  "wallUi"],
  visibility: {
    "dueDate": true,
    "status": true,
    "orderDate": true,
    "customerId": true,
    "containerId": true,
    "shipperId": true,
    "destinationId": true,
    "orderLocationAliasIds": true,
    "groupUi": true,
    "wallUi": true,
  },
};


export const itemsFieldsSetting = {
  order: ["itemId", "status", "planQuantity", "-", "uom", "gtin", "preferredLocation",
      "orderDetailId", "description"],
  visibility: {
    "itemId": true,
    "status": true,
    "planQuantity": true,
    "uom": true,
    "gtin": true,
    "preferredLocation": true,
    "description": true,
    "orderDetailId": false,
  },
};

/* One import
  {
    completed: 1447943430477
    domainId: "Import-Thu Nov 19 14:30:30 UTC 2015"
    filename: "ordersOnePerDay.csv"
    gtins: null
    itemIds: "CUL-CS-16,CUL-CS-10,CUL-CS-12,CUL-CS-6"
    linesFailed: 0
    linesProcessed: 8
    orderIds: "444444,22222,555555,33333,11111"
    ordersProcessed: 5
    persistentId: "1c434091-3f0e-4c16-aed7-4715177b9a69"
    received: 1447943430225
    status: "Complete"d
    transportType: "APP"
    username: "mfedak@gmail.com"
  }
*/

export const importFieldsSetting = {
  order: ["received", "filename", "linesProcessed", "-", "status",  "linesFailed",
    "ordersProcessed", "transportType", "username", "completed", "domainId"],
  visibility: {
    "received": true,
    "filename": true,
    "status": true,
    "linesProcessed": true,
    "linesFailed": true,
    "ordersProcessed": true,
    "transportType": true,
    "username": true,
    "completed": false,
  },
};

/* One pick
  {
    "createdAt": 1447714271474,
    "type": "COMPLETE",
    "itemId": "883929463862",
    "itemLocation": "P2001721",
    "wiPlanQuantity": 1,
    "wiActualQuantity": 1,
    "itemUom": "EA",
    "itemDescription": "",
    "workerName": "008, CSLGO ",
    "deviceGuid": "0x0000021d",
    "persistentId": "d3e28f6c-e8d6-4da3-bc76-3c9c74faf100",
    "orderId": "42910564",
    "devicePersistentId": "0a7c4291-c47e-4ac9-9e01-ff1a19f81c04",
    "workerId": "CSLGO008",
    "orderDetailId": "6af21da7-6a3c-4947-87a8-a1a1aa5538af",
    "workInstructionId": "c19de6b5-6531-41bd-80d9-2695b42dd48c",
    "resolved": false,
    "resolvedAt": null,
    "resolvedBy": null
  }
*/

export const picksFieldsSetting = {
  order: ["createdAt", "type", "itemId", "workerId+workerName", "-","itemLocation", "wiPlanQuantity",
   "wiActualQuantity", "itemUom", "itemDescription", "deviceGuid",
   "orderId", "workerId"],
  visibility: {
    "createdAt": true,
    "type": true,
    "itemId": true,
    "itemLocation": true,
    "wiPlanQuantity": true,
    "wiActualQuantity": true,
    "itemUom": true,
    "itemDescription": true,
    "deviceGuid": true,
    "workerId": false,
    "workerId+workerName": true,
  },
}
