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
        orders: {
            table: {
                columns: ["orderId", "customerId", "shipperId", "destinationId", "containerId", "readableDueDate", "status", "readableDueDate"]
            },
            pivot: {
                fields: [
                    {
                        name: 'status',
                        caption: 'Status',
                        sort: {order: "asc"}
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
        options: {
            "cols": ["status"]
            ,"rows": ["customerId", "shipperId"]
            ,"hiddenAttributes": ["domainId", "containerId", "orderDate", "updated", "pickStrategy", "persistentId", "orderType", "active"]
        },
        selectedOrders: [],
        orders: []

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
