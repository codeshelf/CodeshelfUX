import _ from "lodash";
import Promise from "bluebird";

const noop = () => {};

    export default function (findReferences, getReference, onProgress = noop, filter, max=500) {
    var error = null;
    console.log("searching with filter: ", filter);
    var totalOrders = [];
    var total = 0;
    let promise = findReferences(filter)
        .then((orderRefs) =>{
            total = _.size(orderRefs);
            if (total > max) {
                throw new Error("Search exceeded maximum results, narrow your search. Total: " + total);
            }
            return Promise.map(_.chunk(orderRefs, 100), (orderRefSet) =>{
                if (error) {
                    return error;
                }
                return Promise
                    .map(orderRefSet, (orderRef) =>{
                        if (error) {
                            return error;
                        }
                        return Promise.resolve(getReference(orderRef));
                    }, {concurrency: 2})
                    .then((orders) => {
                        totalOrders = totalOrders.concat(orders);
                        onProgress(totalOrders, total);
                    });
                }, {concurrency: 1});
        })
        .then(() => {
            onProgress(totalOrders, total);
            return totalOrders;
        })
        .catch(Promise.CancellationError, (e) => {
            console.log("cancelling order search with filter", filter, e);
            error = e;
        });
    return promise;
}
