import  React from "react";

export default class Search extends React.Component {

    refresh() {
        return this.doSearch();
    }

    doSearch() {
        console.warn("doSearch should be overriden");
    }

    onUpdated(newResults) {
        return this.props.onUpdated(newResults);
    }

    render() {
        return (<div></div>);
    }
}
