import  React from "react";
import DocumentTitle from "react-document-title";
import {Input, Checkbox, TextArea, MultiSelect} from "components/common/Form";
import Text from "data/types/Text";

export default class FormFields extends React.Component{

    constructor(props) {
        super(props);
    }

    renderMultiSelect(objField, index, value, handleChange, disabled) {
        if (objField.type === Array) {
            let {name, label, required, readonly, options} = objField;
            function handleMultiSelectChange(values) {
                handleChange(objField, values.toJS());
            }
            return (
                <MultiSelect label={label}
                        key={name}
                        name={name}
                        options={options}
                        values={value}
                        onChange={handleMultiSelectChange}/>
            );
        } else {
            return null;
        }
    }

    renderTextArea(objField, index, value, handleChange, disabled) {

        if (objField.type === Text) {
            let {name, label, required, readonly} = objField;
            function handleInputTextChange(e) {
                handleChange(objField, e.target.value);
            }

            return (
                <TextArea label={label} key={name} name={name} value={value} rows="10" onChange={handleInputTextChange}/>
            );
        } else {
            return null;
        }
    }

    renderBooleanInput(objField, index, value, handleChange, disabled){
        if (objField.type === Boolean) {
            let {name, label, required, readonly} = objField;
            function handleCheckboxChange(e) {
                handleChange(objField, e.target.checked);
            }

                return (<Checkbox label={label} key={name} name={name} value={value} onChange={handleCheckboxChange} required={required} readonly={readonly}/>);
        } else {
            return null;
        }
    }

    renderTextInput(objField, index, value, handleChange, disabled) {
        let {name, label, required, hidden, readOnly} = objField;
        function handleInputTextChange(e) {
            handleChange(objField, e.target.value);
        }
        return (
                <Input key={name} ref={name}
                 type="text"
                 name={name}
                 label={label}
                 value={value}
                 required={required}
                 disabled={disabled}
                 hidden={hidden}
                 readOnly={readOnly}
                 autoFocus={index == 0}
                 onChange={handleInputTextChange}
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
                        let value= formData.get(objField.name);
                        return this.renderCustomInput( objField, i, value, handleChange, savePending)
                            || this.renderBooleanInput(objField, i, value, handleChange, savePending)
                            || this.renderMultiSelect( objField, i, value, handleChange, savePending)
                            || this.renderTextArea(    objField, i, value, handleChange, savePending)
                            || this.renderTextInput(   objField, i, value, handleChange, savePending);
                    })
        }
        </div>);
    }
};
