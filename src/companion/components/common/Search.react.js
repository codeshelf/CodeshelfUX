import  React from "react";

export default class Search extends React.Component {

    refresh() {
        this.doSearch();
    }

    doSearch() {
    }

    onUpdated(newResults) {
        this.props.onUpdated(newResults);
    }

    render() {
        return (<div></div>);
    }
}
