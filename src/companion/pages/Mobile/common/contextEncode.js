export function encodeContextToURL(selected) {
  const domainId = selected.selectedFacility.domainId;
  const customerId = selected.selectedCustomer.domainId || 'ALL';
  return domainId + "/customers/" + customerId;
}
