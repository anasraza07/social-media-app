import { useRef, useContext } from "react";
import "./Login.css"
import axios from "axios";

import { GlobalContext } from "../../context/Context";
import { baseUrl } from "../../core";

const Login = () => {
    const { state, dispatch } = useContext(GlobalContext);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        state.isLogin = null;
        try {
            const response = await axios.post(`${baseUrl}/api/v1/login`, {
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value
            }, {
                withCredentials: true
            })
            console.log(response.data)
            setTimeout(() => {
                dispatch({
                    type: "USER_LOGIN",
                    payload: response.data.data
                })
            }, 1000)
        } catch (e) {
            console.log(e.response.data)
        }
    }

    return (
        <div>
            <h1>Login Page</h1>
            {/* <h2>{state.name} <button onClick={changeNameHandler}>Change name</button></h2> */}
            {JSON.stringify(state)}
            <form id="loginForm" onSubmit={loginSubmitHandler}>
                <label htmlFor="emailInput">Email: </label>
                <input type="email" id="emailInput" ref={emailInputRef} required />
                <br />
                <label htmlFor="passwordInput">Password: </label>
                <input type="password" id="passwordInput" ref={passwordInputRef} required />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;