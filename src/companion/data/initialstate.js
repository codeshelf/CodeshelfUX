import messages from './messages';

const initialLocale = 'en';

var endpoint = "";
if (process.env.IS_BROWSER) {
    if (window.location.hostname === 'localhost' && window.location.port === '8000') {
        endpoint = "http://localhost:8181";
    }
}



const data = {
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
    },
    selectedWorkerForm: null,
    workers: []
};

import Chance from 'chance';
import _ from 'lodash';
const chance = new Chance();
//TODO move to fake store
function generateWorker() {
    return   {
        "_id": chance.hash({length: 20}),
        "lastName": chance.last(),
        "firstName": chance.first(),
        "badgeId": chance.hash({length: 12}),
        "workerId": chance.hash({length: 12}),
        "groupId": chance.hash({length: 12})
    };
}
data.workers = _.range(120).map(() => generateWorker());

export default data;
