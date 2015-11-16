import {toProperties, createTypeRecord} from "./properties";
export const types = [
    {value: "OrderImportBeanTransformation",           label: "Import Order Record Change"},
    {value: "OrderImportHeaderTransformation",         label: "Import Order Header Change"},
    {value: "OrderImportCreateHeader",                 label: "Import Order Header Add"},
    {value: "OrderImportLineTransformation",           label: "Import Order Line Change"},
    {value: "OrderOnCartContent",                      label: "Export OrderOnCart Change"},
    {value: "WorkInstructionExportContent",            label: "Export Work Inst. Content"},
    {value: "WorkInstructionExportCreateHeader",       label: "Export Work Inst. Header Add"},
    {value: "WorkInstructionExportCreateTrailer",      label: "Export Work Inst. Trailer Add"},
    {value: "WorkInstructionExportLineTransformation", label: "Export Work Inst. Line Change"}
];
export const keyColumn = "type";
export const properties = toProperties([
    {id: 'type',
     title: 'Type',
     options: types},
    {id: 'active',
     title: "Active"}
]);

export function toLabel(property) {
    return property.toUpperCase();
}

export const ExtensionPoint = createTypeRecord(properties);
