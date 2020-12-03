import React, { useState } from 'react';
import { useDispatch } from 'react-redux';          // redux 이용
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (evt) => {
        setEmail(evt.currentTarget.value);
    }

    const onPasswordHandler = (evt) => {
        setPassword(evt.currentTarget.value);
    }

    const onSubmitHandler = (evt) => {
        evt.preventDefault();           // 이걸 해줘야 그냥 refresh가 되지 않는다.
        // console.log("email", Email);
        // console.log("password", Password);

        let body = {
            email: Email
            ,password: Password
        };

        // 기본형
        // Axios.post('/api/users/login', body).then(res => {
        //
        // });

        // redux 사용
        dispatch(loginUser(body))
            .then(res => {
                if (res.payload.loginSuccess) {
                    props.history.push('/');
                }
                else {
                    alert("Error");
                }
            });
    }

    return (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh' }}>
            <form style={{ display:'flex', flexDirection:'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} autoFocus />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
