import messages from './messages';

const initialLocale = 'en';

export default {
    endpoint: "http://localhost:8181",
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
    selectedFacility: {
        id: "uuuuuuiiiiiddd",
        domainId: "F1"
    },
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
