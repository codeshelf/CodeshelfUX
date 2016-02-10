import  React from "react";
import AddModalForm from "components/common/list/AddModalForm";
import {getAPIContext} from "data/csapi";

export default class ExtensionPointAdd extends React.Component{

    render() {
        return (<AddModalForm title="Add Extension Points"
                    addAction={getAPIContext().addExtensionPoint}
                            {...this.props} />);
    }
};
