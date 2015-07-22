import _ from "lodash";

/*
 Returns an array of self and parents with a field
 */
function walkDimParent(dim) {
    if (dim && dim.field) {
        return _.flattenDeep([dim, walkDimParent(dim.parent)]);
    } else {
        return [];
    }
}

function extractField(dim) {
    let dimPaths = {
        field: "field.name",
        value: "value",
        values: "values"
        };

    let fieldSpec = _.transform(dimPaths, (result, path, key) => {
        result[key] = _.get(dim, path);
    });
    fieldSpec.values = (fieldSpec.value) ? [fieldSpec.value] : fieldSpec.values;
    delete fieldSpec.value;
    return fieldSpec;
}

export function matchDimensions(selected, dim) {
    let result = dim.field == selected.field && _.isEmpty(_.xor(dim.values, selected.values));
    return result;
}

export function extractDimensions(cell) {
    let dimensions = _.chain([cell.rowDimension, cell.columnDimension])
                         .compact() //remove nulls
                         .map(walkDimParent) //walk self and ancestors for each dim
                         .flattenDeep() //combine all fields from dimensions
                         .map(extractField) //convert the orb.field to the key fields we need
                         .value();
    return dimensions;
}
