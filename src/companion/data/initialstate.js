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
