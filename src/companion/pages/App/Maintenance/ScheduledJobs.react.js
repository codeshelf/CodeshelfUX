import  React from "react";
import DocumentTitle from "react-document-title";
import ListManagement from "components/common/list/ListManagement";
    import {properties, keyColumn} from "data/types/ScheduledJob";

export default class ScheduledJobs extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
        let keyColumn = keyColumn;
        return (<DocumentTitle title="ScheduledJobs">
            <ListManagement results={[]} keyColumn={keyColumn} columnMetadata={columnMetadata}/>
                </DocumentTitle>
               );
    }
};
