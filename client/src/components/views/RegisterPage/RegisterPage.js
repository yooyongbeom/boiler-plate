import React, { useState } from 'react';
import { useDispatch } from 'react-redux';          // redux 이용
import { registerUser } from '../../../_actions/user_action';
import $ from 'jquery';

function RegisterPage(props) {
    
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (evt) => {
        setEmail(evt.currentTarget.value);
    }

    const onPasswordHandler = (evt) => {
        setPassword(evt.currentTarget.value);
    }

    const onNameHandler = (evt) => {
        setName(evt.currentTarget.value);
    }

    const onConfirmPasswordHandler = (evt) => {
        setConfirmPassword(evt.currentTarget.value);
    }

    const onSubmitHandler = (evt) => {
        evt.preventDefault();           // 이걸 해줘야 그냥 refresh가 되지 않는다.
        // console.log("email", Email);
        // console.log("password", Password);

        if (Password !== ConfirmPassword) {
            // $("#txtConfirmPassWord").focus();                    // jquery로 하면 focus strike... 기분나쁘다.
            document.getElementById('txtPassWord').select();  // 얘는 된다.

            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }

        let body = {
            email: Email
            ,name: Name
            ,password: Password
        };

        // redux 사용
        dispatch(registerUser(body))
            .then(res => {
                if (res.payload.success) {
                    props.history.push('/login');
                }
                else {
                    alert("Failed to sign up");
                }
            });
    }

    return (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh' }}>
            <form style={{ display:'flex', flexDirection:'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} id="txtPassWord" />
                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} id="txtConfirmPassWord" />
                <br />
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage
