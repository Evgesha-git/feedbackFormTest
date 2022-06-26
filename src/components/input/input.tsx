import React from "react";
import './input.scss'

interface Props {
    type: string;
    placeHolder: string;
    action?: any;
    error: boolean;
    errorMessage: null | string;
    value: string;
    name: string;
    reset?:any;
}

const Input = React.memo((props: Props) => {
    console.log('render input')
    return (
        <div className='input_feedback_form'>
            <input
                type={props.type}
                placeholder={props.placeHolder}
                value={props.value}
                onChange={props.action}
                name={props.name}
                className={props.error ? 'input_error' : ''}
                onFocus={props.reset}
            />
            {props.error ? <span className='error_message'>{props.errorMessage}</span> : null}
        </div>
    )
})

export default Input