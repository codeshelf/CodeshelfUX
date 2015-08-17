import  React from "react";
import SFTPForm from "./SFTPForm";

const formMetadata = SFTPForm.appendMetadata([
                      {name: "importPath",
                       label: "Import Path",
                       required: true},
                      {name: "archivePath",
                       label: "Archive Path",
                       required: true}
                                                     ]);
export default class name extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<SFTPForm title="SFTP Import" formMetadata={formMetadata} />);
    }
};
