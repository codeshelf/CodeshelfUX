import Promise from 'bluebird';

const customers = {
    total: 2,
    results: [{
      domainId: "WorldGo",
      name: "WorldGo"
    }, {
      domainId: "Janus",
      name: "Janus"
    }],
}

export function getCustomers() {
  return Promise.delay(Promise.resolve(customers), 500);
}
