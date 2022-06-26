import React, {useState} from "react";
import Input from "../input/input";
import './form.scss';
import InputDate from "../inputDate/inputDate";

interface Inputs{
    value: string;
    error: boolean;
    errorMessage: string;
}

const Form: React.FC = () => {
    const regExpInput:RegExp = /^([A-Za-z]{3,30}\s)[A-Za-z]{3,30}$/;
    const regExpEmail:RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
    const regExpPhone:RegExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    const regExpText:RegExp = /^[a-zA-Zа-яёА-ЯЁ\s\n]{10,300}$/g;
    const initialState:Inputs = {
        value: '',
        error: false,
        errorMessage: '',
    }
    const [inputState, setInputState] = useState(initialState);
    const [emailState, setEmailState] = useState(initialState);
    const [telState, setTelState] = useState(initialState);
    const [textState, setTextState] = useState(initialState);
    const [dateState, setDateState] = useState({value: '', error: false});
    const [buttonState, setButtonState] = useState(false);
    const [fetchResult, setFetchResult] = useState({
        status: false,
        message: '',
        send: false,
    })

    const validateInput = React.useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'text'){
            if (e.target.type === 'text'){
                if (regExpInput.test(e.target.value)) setInputState({value: e.target.value.toUpperCase(), error: false, errorMessage: ''});
                if (!regExpInput.test(e.target.value)){
                    setInputState({value: e.target.value.toUpperCase(), error: true, errorMessage: 'Некорректное имя'})
                }
                if (e.target.value === '') setInputState({...inputState, error: false, value: e.target.value.toUpperCase()});
            }
        }
        if (e.target.type === 'email'){
            if (regExpEmail.test(e.target.value)) setEmailState({value: e.target.value, error: false, errorMessage: ''});
            if (!regExpEmail.test(e.target.value)){
                setEmailState({value: e.target.value, error: true, errorMessage: 'Некорректный email'});
            }
            if (e.target.value === '') setEmailState({...emailState, error: false, value: e.target.value});
        }
        if (e.target.type === 'tel'){
            setTelState({...telState, value: e.target.value, error: false});
            if (!regExpPhone.test(e.target.value)){
                setTelState({value: e.target.value, error: true, errorMessage: 'Некорректный номер телефона'});
            }
            if (e.target.value === '') setTelState({...telState, error: false, value: e.target.value});
        }
    }, [inputState, telState, emailState]);

    console.log('render')

    const validateText = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        if(regExpText.test(e.target.value)) setTextState({...textState, value: e.target.value, error: false});
        if (!regExpText.test(e.target.value)){
            if (e.target.value.length < 10) setTextState({value: e.target.value, error: true, errorMessage: 'Текст слишком короткий'});
            if (e.target.value.length > 300) setTextState({value: e.target.value, error: true, errorMessage: 'Текст слишком длинный'});
        }
        if (e.target.value === '') setTextState({...textState, error: false, value: e.target.value});
    }

    const resetSend = () => {
        setFetchResult({...fetchResult, send: false});
    }

    const validDate = (e:React.ChangeEvent<HTMLDataElement>) => {
        setDateState({error: false, value: e.target.value})
        if (new Date(e.target.value) >= new Date()) {
            setDateState({...dateState, error: true})
        }
    }

    const formHandler = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let errorForm:boolean = false;

        if (!regExpInput.test(inputState.value)) {
            errorForm = true;
            setInputState({...inputState, error: true, errorMessage: 'Некорректное имя'});
        };
        if (!regExpEmail.test(emailState.value)) {
            errorForm = true;
            setEmailState({...emailState, error: true, errorMessage: 'Некоррекный email'});
        };
        if (!regExpPhone.test(telState.value)) {
            errorForm = true;
            setTelState({...telState, error: true, errorMessage: 'Некорректный номер телефона'});
        };
        if (!regExpText.test(textState.value)) {
            errorForm = true;
            if (textState.value.length < 10) setTextState({...textState, error: true, errorMessage: 'Текст слишком короткий'});
            if (textState.value.length > 300) setTextState({...textState, error: true, errorMessage: 'Текст слишком длинный'});
        }
        if (new Date(dateState.value) >= new Date()) {
            errorForm = true;
            setDateState({...dateState, error: true});
        }

        if (errorForm) return


        fetch('https://jsonplaceholder.typicode.com/posts',{ //Брал первую попавшуюся апишку, чтоб отправить данные
            method:"POST",
            body:JSON.stringify(
                {
                    name: inputState.value,
                    email: emailState.value,
                    tel: telState.value,
                    message: textState.value,
                    date: dateState.value
                }
            )
        })
            .then(res=> {
                setButtonState(true);
                if (res.status >= 200 && res.status < 300){
                    return res;
                }else{
                    let error = new Error(res.statusText);
                    throw error;

                }
                return res;
            })
            .then(res => res.json())
            .then(json=> {
                setButtonState(false);
                console.log(json);
                setFetchResult({
                    status: true,
                    message: 'Данные успешно отправлены',
                    send: true
                });
                setInputState({...inputState, value: ''});
                setTelState({...telState, value:''});
                setEmailState({...emailState, value: ''});
                setTextState({...textState, value: ''});
                setDateState({...dateState, value: ''})
            })
            .catch(error => {
                setButtonState(false);
                console.log(error.message);
                setFetchResult({
                    status: false,
                    message: `Возникла ошибка: ${error.message}`,
                    send: true
                })
            })
    }

    return (
        <div className='feedback_form'>
            <form action="" noValidate onSubmit={formHandler}>
                <Input
                    type={'text'}
                    action={validateInput}
                    errorMessage={inputState.errorMessage}
                    error={inputState.error}
                    placeHolder={'Введиет имя'}
                    value={inputState.value}
                    name={'name'}
                    reset={resetSend}
                />
                <Input
                    type={'email'}
                    placeHolder={'Введите tmail'}
                    error={emailState.error}
                    errorMessage={emailState.errorMessage}
                    value={emailState.value}
                    action={validateInput}
                    name={'mail'}
                    reset={resetSend}
                />
                <Input
                    type={'tel'}
                    placeHolder={'+7 (999) 999-99-99'}
                    error={telState.error}
                    errorMessage={telState.errorMessage}
                    value={telState.value}
                    action={validateInput}
                    name={'tel'}
                    reset={resetSend}
                />
                <InputDate
                    action={validDate}
                    value={dateState.value}
                    error={dateState.error}
                    reset={resetSend}
                />
                <div className='text_form'>
                    <textarea
                        name='text'
                        onChange={validateText}
                        className={textState.error ? 'error_text' : ''}
                        onFocus={resetSend}
                        value={textState.value}
                    ></textarea>
                    {textState.error ? <span className={'error_text_message'}>{textState.errorMessage}</span> : null}
                </div>
                <button type="submit" disabled={buttonState}>Отправить</button>
                {fetchResult.send ? <div className={!fetchResult.status ? 'error_send send_message': 'send_message'}>
                    <span>{fetchResult.message}</span>
                </div> : null}
            </form>
        </div>
    )
}

export default Form