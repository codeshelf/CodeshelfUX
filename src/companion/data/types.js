var _ = require("lodash");

const StatusSummaryTemplate = [{key: "released",
                                color: "#CC78DE",
                                label: "Remaining",
                                value: 0},
                                {key: "inprogress",
                                color: "#7B0793",
                                label: "In Progress",
                                value: 0},
                                {key: "short",
                                color: "#D3D3D3",
                                label: "Short",
                                value: 0},
                                {key: "complete",
                                color: "#F1F1F1",
                                label: "Complete",
                                value: 1}]; //to draw something


export class StatusSummary {
    static shortCount(statusSummary) {
        return statusSummary.short;
    }

    static sumByKeys(statusSummary, keys) {
        //todo validate keys with StatusEnum
        return _.reduce(keys, function(sum, key){
            return sum + statusSummary[key];
        }, 0);
    }

    static toLabel(statusEnum) {
        var obj = _.find(StatusSummaryTemplate, {key: statusEnum});
        return obj.label;
    }

    static toColor(statusEnum) {
        var obj = _.find(StatusSummaryTemplate, {key: statusEnum});
        return obj.color;
    }

    static toSummaryList(statusSummary) {
        return _.map(StatusSummaryTemplate, (template) => {
            return {
                id: template.key,
                label: template.label,
                quantity: statusSummary[template.key]
            };
        });
    }
};

StatusSummary.Templates = StatusSummaryTemplate;
