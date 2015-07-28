import messages from './messages';

const initialLocale = 'en';

var endpoint = "";
if (process.env.IS_BROWSER) {
    if (window.location.port === '8000') {
        endpoint = `http://${window.location.hostname}:8181`;
    }
}



const data = {
    endpoint: endpoint,
    $pendingActions: {},
    $subscriptions: {},
    preferences: {
        version: "1.3",
        workInstructions: {
            table: {
                columns: ["persistentId", "status"],
                sortSpecs: {}
            },
            pivot: {
                fields: [
                    {name: 'gtin', caption: "GTIN"},
                        {name: 'assignedCheName', caption: "CHE"},
                    {name: 'uomNormalized', caption: "UOM"},
                    {name: 'pickerId', caption: "Worker"},
                        {name: 'store', caption: 'Store'}, //pseudo field
                    {name: 'containerId', caption: 'Pallet'}, //pseudo field
                    {
                    name: "count",
                    caption: "Lines",
                    dataSettings: {aggregateFunc: 'count'}
                    },
                    {
                    name: "actualQuantity",
                    caption: "QTY",
                    dataSettings: {aggregateFunc: 'sum'}
                    }
                ],
                rowFields: [],
                columnFields: [],
                dataFields: ["count"]
            }
        },
        workers: {
            table: {
                columns: ["lastName", "firstName", "badgeId", "updated"],
                sortSpecs: {"lastName": {order: "asc"}}
            }
        },

        orders: {
            table: {
                columns: ["orderId", "customerId", "shipperId", "destinationId", "containerId", "dueDate", "status"],
                sortSpecs: {
                    "orderId": {order: "asc"}
                }
            },
            pivot: {
                fields: [
                    {
                        name: 'status',
                        caption: 'Status',
                        sort: {order: "asc"}
                        },
                    {name: "pivotDetailCount",
                     caption: "Lines"},
                    {name: "pivotRemainingDetailCount",
                     caption: "Lines Remaining"},

                     {name: "caseQuantity",
                    caption: "Cases",
                     dataSettings: {aggregateFunc: 'sum'}
                    },
                    {name: "eachQuantity",
                    caption: "Eaches",
                    dataSettings: {aggregateFunc: 'sum'}
                    },
                    {name: "otherQuantity",
                     caption: "Other UOM",
                     dataSettings: {aggregateFunc: 'sum'}
                     },
                    {
                        name: 'customerId',
                        caption: 'Customer',
                        sort: { order: "asc"}
                    },
                    {
                        name: 'destinationId',
                        caption: 'Destination',
                        sort: { order: "asc"}
                    },
                    {
                        name: "shipperId",
                        caption: "Shipper",
                        sort: { order: "asc"}
                    },
                    {
                        name: "dueDay",
                        caption: "Date Due",
                        sort: { order: "asc"}
                    },
                    {
                        name: "dueTime",
                        caption: "Time Due",
                        sort: { order: "asc"}
                    },
                    {
                        name: "count",
                        caption: "Count",
                        dataSettings: {aggregateFunc: 'count'}

                    }
                ],
                rowFields    : [ 'dueDay', "customerId" ],
                columnFields : [ 'status' ],
                dataFields: ["count"]
            }
        }
    },
    auth: {
        form: {
            fields: {
                email: '',
                password: '',
                store: false
            },
            error: null
        },
        changepassword: {
            values: {
                old: "",
                new: "",
                confirm: ""
            },
            errors: {
                old: [],
                new: [],
                confirm: []

            }
        }
    },
    pivot: {
        selectedOrders: [],

        orders: {
            updated: null,
            values: []
        },
        selectedWorkInstructions: [],
        workInstructions: []

    },
    i18n: {
        formats: {},
        locales: initialLocale,
        messages: messages[initialLocale]
    },
    selectedFacility: null,
    facilities: [],
    user: {
        authData: null
    },
    selectedWorkerForm: null,
    workers: [],
    issues: {}
};

export default data;
