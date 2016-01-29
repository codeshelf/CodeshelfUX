import Promise from "bluebird";

const cartInfo = { "className": "Che", "domainId": "CHE_13", "persistentId": "165dc7ed-c85a-49be-b20b-46d1c9c358cc", "deviceGuid": "0x000001df", "description": "", "lastBatteryLevel": 0, "networkDeviceStatus": null, "lastContactTime": null, "networkAddress": 0, "color": "GREEN", "scannerType": "CODECORPS3600", "processMode": "SETUP_ORDERS", "lastScannedLocation": null, "associateToCheGuid": null, "cheLighting": "POSCON_V1" };

export function getCart(domainId) {
  return Promise.delay(Promise.resolve(cartInfo), 500);
}