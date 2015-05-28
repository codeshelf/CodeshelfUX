import React from 'react';
import {Input} from 'react-bootstrap';
import PureComponent from 'components/common/PureComponent';

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
        return (<Input type='select' className="full-width" label={label} value={value} data-init-plugin="select2"
                 onChange={onChange}>
                    {
                        options.map((option) => {
                            let label = (option.label != null) ? option.label : option.value;
                            let selected = option.value === selected;
                            return <option key={option.value} value={option.value}>{label}</option>;
                        })

                    }
                </Input>);
    }
};
