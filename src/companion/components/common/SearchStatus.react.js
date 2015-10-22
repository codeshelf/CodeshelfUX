import  React from "react";
import RelativeTimeDisplay from "./RelativeTimeDisplay";
import {Map} from "immutable";
import {ErrorDisplay} from "components/common/Form";
export default class SearchStatus extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let {results, errorMessage} = this.props;
        if (results) {
            let updatedTime = results.get("updated");
            let total = results.get("total");
            let currentCount = results.get("values").count();
            return (<div>
                        {(updatedTime) ? <h5>Last Updated: <RelativeTimeDisplay time={updatedTime} /></h5>: null}
                        <ErrorDisplay message={errorMessage} />
                    <h5>Loading  {currentCount} / {total} </h5>
                    </div>);
        } else {
            return <div></div>;
        }
    }
};
SearchStatus.displayName = "SearchStatus";
