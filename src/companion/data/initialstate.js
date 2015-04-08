import messages from './messages';

const initialLocale = 'en';

var endpoint = "";
if (process.env.IS_BROWSER) {
    if (window.location.hostname === 'localhost' && window.location.port === '8000') {
        endpoint = "http://localhost:8181";
    }
}

export default {
    endpoint: endpoint,
    $pendingActions: {},
    auth: {
        form: {
            fields: {
                email: '',
                password: ''
            },
            error: null
        }
    },
    i18n: {
        formats: {},
        locales: initialLocale,
        messages: messages[initialLocale]
    },
    newTodo: {
        title: ''
    },
    todos: [
        {type: "nolocation", description: 'consider ‘stop doing’ app', total: 4},
        {type: "shorted", description: 'relax', total: 3}
    ],
    selectedFacility: null,
    blockedwork: {
        summaries:
        [
            {type: "nolocation", description: 'consider ‘stop doing’ app', total: 4},
            {type: "shorted", description: 'relax', total: 3}
        ]
    },
    user: {
        authData: null
    }

};
