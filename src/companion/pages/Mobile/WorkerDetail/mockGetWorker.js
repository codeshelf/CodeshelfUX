import Promise from "bluebird";

const workerInfo = {
  "domainId":"Lshi",
  "persistentId":"09dec32a-ad82-4caf-8479-0d81776ffb0b",
  "active":true,
  "firstName":"Lei",
  "lastName":"Shi",
  "middleInitial":null,
  "badgeId":"Lshi",
  "groupName":"IT",
  "hrId":"Lshi",
  "updated":1443706098583,
  "lastLogin":null,
  "lastLogout":null,
  "lastChePersistentId":null,
  "badgeUnique":true,
  "className":"Worker"
};


export function getWorker(workerId) {
  return Promise.delay(Promise.resolve(workerInfo), 500);
}

const workerHistory = {
  "total": 96,
  "sortedBy": null,
  "results": [
    {
      "persistentId": "ca7457a0-6832-4f4d-b554-d4ec85587ace",
      "type": "COMPLETE",
      "itemId": "673419236386",
      "itemUom": "EA",
      "itemDescription": "",
      "itemLocation": "P5002011",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "workerName": "Shi, Lei ",
      "orderId": "43134276",
      "deviceGuid": "0x000001f8",
      "createdAt": 1448475239421,
      "devicePersistentId": "cf184152-301a-4c9c-99c5-008f6348c1c3",
      "workerId": "Lshi",
      "orderDetailId": "d27207a7-0881-4320-89aa-2e5b8e668fde",
      "workInstructionId": "9e0b7dd2-e99b-4426-bed3-ecb58c6fee7d",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    },
    {
      "persistentId": "473222d7-1f72-4d73-a12b-74d91198af2b",
      "type": "COMPLETE",
      "itemId": "673419236386",
      "itemUom": "EA",
      "itemDescription": "",
      "itemLocation": "P5002011",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "workerName": "Shi, Lei ",
      "orderId": "43134326",
      "deviceGuid": "0x000001f8",
      "createdAt": 1448475234316,
      "devicePersistentId": "cf184152-301a-4c9c-99c5-008f6348c1c3",
      "workerId": "Lshi",
      "orderDetailId": "41923212-668e-4bbd-9857-21fc15258b7d",
      "workInstructionId": "fdc00797-a428-4079-ba8f-f50263810ecf",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    },
    {
      "persistentId": "d04332dc-f2c5-4670-afdb-b9dde2f93145",
      "type": "COMPLETE",
      "itemId": "673419243896",
      "itemUom": "EA",
      "itemDescription": "",
      "itemLocation": "P5270031",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "workerName": "Shi, Lei ",
      "orderId": "43134279",
      "deviceGuid": "0x000001f8",
      "createdAt": 1448475175352,
      "devicePersistentId": "cf184152-301a-4c9c-99c5-008f6348c1c3",
      "workerId": "Lshi",
      "orderDetailId": "d4909963-8cd7-41ac-b112-2551606ba549",
      "workInstructionId": "42bbe9ff-04be-47a4-b23a-fbb57882a831",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    },
    {
      "persistentId": "4e4669f0-be48-4332-b523-47a05e23bb9e",
      "type": "COMPLETE",
      "itemId": "673419243896",
      "itemUom": "EA",
      "itemDescription": "",
      "itemLocation": "P5270031",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "workerName": "Shi, Lei ",
      "orderId": "43134289",
      "deviceGuid": "0x000001f8",
      "createdAt": 1448475171941,
      "devicePersistentId": "cf184152-301a-4c9c-99c5-008f6348c1c3",
      "workerId": "Lshi",
      "orderDetailId": "0b59287a-784c-4202-b67d-560f366f9932",
      "workInstructionId": "b0f000dd-b447-450c-8e45-fb093f5e6a71",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    },
    {
      "persistentId": "8d34137c-9fff-4f4a-a461-164772a3f000",
      "type": "COMPLETE",
      "itemId": "673419232081",
      "itemUom": "EA",
      "itemDescription": "",
      "itemLocation": "P5001341",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "workerName": "Shi, Lei ",
      "orderId": "43134283",
      "deviceGuid": "0x000001f8",
      "createdAt": 1448475146969,
      "devicePersistentId": "cf184152-301a-4c9c-99c5-008f6348c1c3",
      "workerId": "Lshi",
      "orderDetailId": "93c8e8a4-af53-4c55-ad19-77f96d4bd46d",
      "workInstructionId": "f50121c3-7220-41e7-93a9-310b1ed5506d",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    }
  ]
};


export function getWorkerHistory(workerId) {
  return Promise.delay(Promise.resolve(workerHistory.results), 500);
}
