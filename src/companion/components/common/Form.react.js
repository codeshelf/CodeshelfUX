import React from 'react';
import Icon from 'react-fa';
import {Input as BSInput, Button} from 'react-bootstrap';
import PureComponent from 'components/common/PureComponent';
import classnames from 'classnames';
import _ from "lodash";
import {List} from "immutable";
require('./Form.styl');

export class ErrorDisplay extends PureComponent {
    render() {
        let {message} = this.props;
        return (
            (message) ?
                <div className="alert alert-danger">
                    {message}
                </div> : null
        );
    }
}

export class SubmitButton extends React.Component {
    render() {
        let {label, submitPending}  = this.props;
        return (<Button bsStyle="primary" type="submit" disable={submitPending}>
                                <span>
                                    {(submitPending) && <Icon name="spinner" style={{marginRight: ".5em"}} />}
                                    {label}
                                </span>
                            </Button>);
    }
}


export class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "submitPending" : false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({"submitPending": true});
        return this.props.onSubmit(e).finally(() => {
            this.setState({"submitPending": false});
        });
    }

    recursiveCloneChildren(children, newProps) {
        return React.Children.map(children, (child) => {
            if(!_.isObject(child)) return child;
            var childProps = _.clone(newProps);
            childProps.children = this.recursiveCloneChildren(child.props.children, newProps);
            return React.cloneElement(child, childProps);
        }.bind(this));
    }

    render() {
        let {submitPending} = this.state;
        let {onSubmit, ...restProps} = this.props;
        return (<form onSubmit={this.handleSubmit} {...restProps}>
                {
                    this.recursiveCloneChildren(this.props.children, {submitPending: submitPending})
                }
               </form>);
    }
}


class  WrapInput extends React.Component {
    handleInputGroupClick(e) {
        var inputs = e.target.getElementsByTagName("input");
        Array.prototype.forEach.call(inputs, function(el, i){
            el.focus();
        });
    }

    render() {
        let {label,
             name,
             required,
             hidden,
             errors = [],
             addOnAfter} = this.props;

        var groupClasses = classnames({
            "form-group": true,
            "form-group-default": true,
            "input-group": (addOnAfter != null)
        });

        var labelClasses = classnames({
            "required": required
        });

        let style = (hidden) ? {display: "none"} : {};
        return (
                <div>
                    <div className={groupClasses} style={style} onClick={this.handleInputGroupClick.bind(this)}>
                        <label htmlFor={name} className={labelClasses}>{label}</label>
                        {this.props.children}
                    </div>
                    {errors.map((error) => {
                        return (<em key={error} htmlFor={name} className="input-error"><span className="text-danger">{error}</span></em>);
                    })}
                </div>
        );
    }

}

export class Input extends React.Component {

    render() {
        let {label,
             type,
             name,
             value,
             errors = [],
             required,
             autoFocus,
             disabled,
             onChange,
             readOnly,
             hidden,
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
        var inputType = (hidden) ? "hidden" : type;
            return (<WrapInput label={label} name={name} required={required} errors={errors} hidden={hidden} addOnAfter={addOnAfter}>
                    <input type={inputType}
                           className={inputClasses}
                           required={required}
                           autoFocus={autoFocus}
                           disabled={disabled}
                           id={name}
                           name={name}
                           label={label}
                           value={value}
                           onChange={onChange}
                           readOnly={readOnly}
                     />
                    {
                        (addOnAfter) ?
                            <span className="input-group-addon">
                                {addOnAfter}
                            </span>
                            :
                            null
                    }
                </WrapInput>);
    }
}

/**
 * Note that this uses the DOM input and not the react-bootstrap Input so that the label is a sibling of the input for pages template
 */
export class Checkbox extends React.Component {
    shouldComponentUpdate() {
        return true;
    }


    //onChange is extremely sensitive to the label htmlFor= matching the input id field uniquely within the page and exactly
    render() {
        let {id, label, value, onChange, name} = this.props;
        let checked = (value) ? true : false;
        let nameAttr = name || id;
        return (<div className="form-group form-group-default" >

                    <div className="checkbox check-primary">
                               <input id={nameAttr} name={nameAttr} type="checkbox" defaultChecked={checked} onChange={onChange} />
                                   <label htmlFor={nameAttr}>{label} </label>
                                </div>
                    </div>
               );
    }
};

export class MultiSelectUnwrapped extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {values: (props.values) ? List(props.values) : List()};
    }

    handleChange(e) {
        let input = e.target;
        if (input.checked) {
            this.setState({values: this.state.values.push(input.value)}, () =>{
                this.props.onChange(this.state.values);
            });
        } else {
                this.setState({values: this.state.values.filterNot( value => input.value === value)}, () =>{
                this.props.onChange(this.state.values);
            });
        }
    }

    render() {
        let {label, options, onChange} = this.props;
        let {values} = this.state;
        let selectLabel = label;
        return (<div>
            {
                options.map((option) =>{
                    let {label, value } = option;
                    let id = selectLabel + value;
                        return <div key={value} className="checkbox check-primary">
                                <input type="checkbox" value={value}  id={id} name={id} defaultChecked={values.includes(value)}
                                 onChange={this.handleChange.bind(this)}/>
                                <label htmlFor={id}>{label}</label>
                                </div>
                })
            }
            </div>
        );
    }
}

export class MultiSelect extends PureComponent {
    render() {
        return <WrapInput {...this.props}>
                   <MultiSelectUnwrapped {...this.props} />
               </WrapInput>
    }
}

export class Select extends PureComponent {
    render() {
        let {label, options, value, onChange, multiple} = this.props;
        return (<BSInput type='select'
                className="full-width"
                label={label}
                value={value}
                multiple={multiple}
                data-init-plugin="select2"
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

export class TextArea extends React.Component {

        render() {
            let {rows, onChange, value } = this.props;
            return (<WrapInput {...this.props}>
                        <textarea  style={{width: "100%", borderStyle: "none"}}rows={rows} onChange={onChange} value={value} />
                   </WrapInput>)
        }
}
