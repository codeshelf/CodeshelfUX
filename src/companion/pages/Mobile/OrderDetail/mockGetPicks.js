
import Promise from "bluebird";


export function getPicks(orderId) {
  return Promise.delay(Promise.resolve([firstPick, secondPick]), 2000);
}

const firstPick = {
  "completed": 1448899968039,
  "status": "COMPLETE",
  "itemMasterId": "930-00020",
//-------------------------------------------------------------
  "pickInstructionUi": "L18",
  "pickerName": "K3WAMQ6ZUINX",
  "assignedCheName": "Lunera 2",
  "planQuantity": 1,
  "actualQuantity": 1,
  "description": "HN-V-G24D-26W-4000-G2",
//---- fields not shown in first iteration --------------------
  "needsScan": true,
  "type": "ACTUAL",
  "orderDetailId": "281044.1",
  "planMaxQuantity": 1,
  "domainId": "144889994058900",
  "nominalLocationId": "A52.B9.T1",
  "orderId": "281044",
  "gtin": "8718421828340",
  "assigned": 1448899940452,
  "uomMasterId": "EA",
  "litLedsForWi": "221>224",
  "wiPosAlongPath": "8.46",
  "persistentId": "8619667a-948e-4570-b5ce-dcbd266ae393",
  "planMinQuantity": 1,
  "uomNormalized": "EA",
  "containerId": "281044",
  "groupAndSortCode": "0001"
};


const secondPick = {
  "completed": 1448899968040,
  "status": "IN PROGRESS",
  "itemMasterId": "985-00015",
//-------------------------------------------------------------
  "pickInstructionUi": "L15",
  "pickerName": "K3WAMZFFSDFGB",
  "assignedCheName": "Lunera 1",
  "planQuantity": 10,
  "actualQuantity": 9,
  "description": "HN-V-SADasd-26W-3000-G2",
//---- fields not shown in first iteration --------------------
  "needsScan": true,
  "type": "ACTUAL",
  "orderDetailId": "281044.1",
  "planMaxQuantity": 1,
  "domainId": "144889994058900",
  "nominalLocationId": "A52.B9.T1",
  "orderId": "281044",
  "gtin": "8718421828340",
  "assigned": 1448899940452,
  "uomMasterId": "EA",
  "litLedsForWi": "221>224",
  "wiPosAlongPath": "8.46",
  "persistentId": "8619667a-948e-4570-b5ce-dcbd266ae394",
  "planMinQuantity": 1,
  "uomNormalized": "EA",
  "containerId": "281044",
  "groupAndSortCode": "0001"
};