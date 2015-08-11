import {Record, Iterable, Seq, fromJS} from "immutable";

export const PropertyRecord = Record({"id": null, "title": null, "type": null});

export function toProperties(objarray) {
    return fromJS(objarray, (key, value) => {
        if (Iterable.isKeyed(value)) {
            return PropertyRecord(value);
        } else {
            return value;
        }
    });
}

export function createTypeRecord(properties) {
    return new Record(Seq(properties).reduce((spec, metadata) => {
        spec[metadata.id] = null;
        return spec;
    }, {}));
}
