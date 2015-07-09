import _ from "lodash";


function walkDimParent(dim) {
    if (dim) {
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
                         .flattenDeep()
                         .map(extractField)
                         .value();
    return dimensions;
}
