import React from 'react';
import {Input as BSInput} from 'react-bootstrap';
import PureComponent from 'components/common/PureComponent';
import classnames from 'classnames';

export class Input extends React.Component {

    handleInputGroupClick(e) {
        var inputs = e.target.getElementsByTagName("input");
        Array.prototype.forEach.call(inputs, function(el, i){
            el.focus();
        });
    }
    render() {
        let {label,
             type,
             name,
             value,
             required,
             autoFocus,
             disabled,
             onChange,
             addOnAfter} = this.props;

        var inputClasses = classnames({
            "form-control": true

        });

        var groupClasses = classnames({
            "form-group": true,
            "form-group-default": true,
            "input-group": (addOnAfter != null)
        });

        var labelClasses = classnames({
            "required": required
        });

        return <div className={groupClasses} onClick={this.handleInputGroupClick.bind(this)}>
            <label htmlFor={name} className={labelClasses}>{label}</label>
                <input type={type}
                       className={inputClasses}
                       required={required}
                       autoFocus={autoFocus}
                       disabled={disabled}
                       id={name}
                       name={name}
                       label={label}
                       value={value}
                       onChange={onChange}
                 />
                {
                    (addOnAfter) ?
                        <span className="input-group-addon">
                            {addOnAfter}
                        </span>
                        :
                        null
                }
              </div>
    }
}

/**
 * Note that this uses the DOM input and not the react-bootstrap Input so that the label is a sibling of the input for pages template
 */
export class Checkbox extends React.Component {
    shouldComponentUpdate() {
        return true;
    }

    render() {
        let {id, label, value, onChange} = this.props;
        let checked = (value) ? true : false;
        return (<div className="checkbox check-primary">
                <input id={id} name={id} type="checkbox" defaultChecked={checked} onChange={onChange} />
                <label htmlFor={id}>{label}</label>
                </div>);
    }
};

export class Select extends PureComponent {
    render() {
        let {label, options, value, onChange} = this.props;
        return (<BSInput type='select' className="full-width" label={label} value={value} data-init-plugin="select2"
                 onChange={onChange}>
                    {
                        options.map((option) => {
                            let label = (option.label != null) ? option.label : option.value;
                            let selected = option.value === selected;
                            return <option key={option.value} value={option.value}>{label}</option>;
                        })

                    }
                </BSInput>);
    }
};
