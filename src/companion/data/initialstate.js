import messages from './messages';

const initialLocale = 'en';

var endpoint = "";
if (process.env.IS_BROWSER) {
    if (window.location.port === '8000') {
      if (process.env.USE_TEST) {
        endpoint = "https://test.codeshelf.com";
      } else {
        endpoint = `http://${window.location.hostname}:8181`;
      }
    }
}



export default {
    endpoint: endpoint,
    $pendingActions: {},
    $subscriptions: {},
    preferences: {
        version: "1.8",
        workInstructions: {
            table: {
                columns: ["itemMasterId", "status"],
                sortSpecs: {}
            },
            pivot: {
                fields: [
                    {name: 'gtin', caption: "GTIN"},
                    {name: 'assignedCheName', caption: "CHE"},
                    {name: 'uomNormalized', caption: "UOM"},
                    {name: 'pickerId', caption: "Worker"},
                    {name: 'status', caption: 'Status'},
                    {name: 'type', caption: 'Type'}, //pseudo field
                    {name: 'store', caption: 'Store'}, //pseudo field
                    {name: 'containerId', caption: 'Container'}, //pseudo field
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
        dailymetric: {
            table: {
        columns: ["localDateUI", "ordersPicked"],
                sortSpecs: {"localDateUI": {order:"desc"}}
            }
        },
        imports: {
            orders: {
                table: {
                    columns: ["received", "filename", "started", "processingTime", "ordersProcessed", "linesProcessed", "linesFailed", "status", "username"],
                    sortSpecs: {"started": {order:"desc"}}
                }

            }
        },
        users: {
            table: {
                columns: ["username", "active"],
                sortSpecs: {"username": {order: "asc"}}
            }
        },
        workers: {
            table: {
                columns: ["lastName", "firstName", "domainId", "updated"],
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
                      name: "orderType",
                      caption: "Type",
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
        },
        setuppassword: {
            values: {
                new: "",
                confirm: ""
            },
            errors: {
                new: [],
                confirm: []

            }
        }

    },
    pivot: {
        selectedOrders: [],

        orders: {
            updated: null,
            total: 0,
            values: []
        },
        selectedWorkInstructions: [],
        workInstructions: {
            updated: null,
            total: 0,
            values: []
        }
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
