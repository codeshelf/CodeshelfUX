import Promise from "bluebird";

const workers = [
  {
    "domainId":"Lshi",
    "persistentId":"09dec32a-ad82-4caf-8479-0d81776ffb0b",
    "active":true,
    "firstName":"Lei",
    "lastName":"Shi",
    "middleInitial":null,
    "groupName":"IT",
    "hrId":"Lshi",
    "updated":1443706098583,
    "lastLogin":null,
    "lastLogout":null,
    "lastChePersistentId":null,
    "badgeUnique":true,
    "className":"Worker"
  },
  {
    "domainId":"SD1XUBVL6HK7",
    "persistentId":"87a076eb-a928-4fbf-9b0c-c4e2e19fc409",
    "active":true,
    "firstName":"Temp",
    "lastName":"Lego 09",
    "middleInitial":null,
    "groupName":null,
    "hrId":null,
    "updated":1443705504428,
    "lastLogin":null,
    "lastLogout":null,
    "lastChePersistentId":null,
    "badgeUnique":true,
    "className":"Worker"
  },
  {
    "domainId":"Kimberly B",
    "persistentId":"af4f3424-213e-4acd-96d7-f009b115fb40",
    "active":true,
    "firstName":"Kimberly",
    "lastName":"B",
    "middleInitial":null,
    "groupName":null,
    "hrId":null,
    "updated":1443706050275,
    "lastLogin":null,
    "lastLogout":null,
    "lastChePersistentId":null,
    "badgeUnique":true,
    "className":"Worker"
  },
  {
    "domainId":"Jaime B",
    "persistentId":"2d3558b7-b6de-4c22-a4bf-01afbb4ff69e",
    "active":true,
    "firstName":"Jaime",
    "lastName":"B",
    "middleInitial":null,
    "groupName":null,
    "hrId":null,
    "updated":1443706054824,
    "lastLogin":null,
    "lastLogout":null,
    "lastChePersistentId":null,
    "badgeUnique":true,
    "className":"Worker"
  },
];

function filterWorkers(badge) {
  return workers.filter(w =>
    new RegExp(badge.replace("*", ".*"), "i").test(w.domainId));
}

export function getWorkersByBadge(badge) {
  return Promise.delay(
    Promise.resolve({
      total: filterWorkers(badge).length,
      results: filterWorkers(badge),
    }),
    500);
}
