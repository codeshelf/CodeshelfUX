import  React from "react";
import DocumentTitle from "react-document-title";
import {Input} from "components/common/Form";


//5let FormField = Record({name: "", label: "", required: false});

export default class FormFields extends React.Component{

    constructor(props) {
        super(props);
    }

    renderTextInput(objField, index, value, handleChange, disabled) {
        let {name, label, required} = objField;
        return (
                <Input key={name} ref={name}
                 type="text"
                 name={name}
                 label={label}
                 value={value}
                 required={required}
                 disabled={disabled}
                 autoFocus={index == 0}
                 onChange={handleChange}
                 />
        );
    }

        renderCustomInput(objField, index, value, disabled) {
        if (objField.customComponent) {
            let CustomComponent = objField.customComponent;
                return (<CustomComponent field={objField} index={index} value={value} disabled={disabled}/>);
        } else {
            return null;
        }
    }

    render() {
        let {formMetadata, formData, savePending, handleChange} = this.props;
        return (
                <div>
                {
                    formMetadata.map((objField, i) =>{
                        let handleFieldChange = (e) => {
                            handleChange(objField, e.target.value);
                        };
                        let value= formData.get(objField.name);
                        return this.renderCustomInput(objField, i, value, handleFieldChange, savePending)
                            || this.renderTextInput(objField, i, value, handleFieldChange, savePending);
                    })
        }
        </div>);
    }
};
