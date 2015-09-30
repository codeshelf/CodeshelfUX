import  React from "react";
import {EditButtonLink} from "components/common/TableButtons";

export default class ExtensionPointEditButton extends React.Component {
    render() {
    var {rowData: formData, ...rest} = this.props;
        var persistentId = formData.get("persistentId");
        return (<EditButtonLink
                    to="extensionpointedit"
                    params={{extensionPointId: persistentId}}
                    {...rest}>
                </EditButtonLink>);
    }

}
