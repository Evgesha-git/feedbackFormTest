import React from "react";
import './inputDate.scss';

interface PropDate{
    action: any;
    value: string;
    error: boolean;
    reset?: any
}

const InputDate = React.memo((props:PropDate) => {
    return (
        <div className={'form_date'}>
            <input
                className={props.error ? 'date_error_input' : ''}
                type="date"
                name="date"
                id="date"
                onChange={props.action}
                value={props.value}
                onFocus={props.reset}
            />
            {props.error ? <span className={'date_error'}>Некорректная дата</span> : null}
        </div>
    )
});

export default InputDate