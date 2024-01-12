import { useRef, useContext, useState } from "react";
import "./Login.css"
import axios from "axios";
import Swal from "sweetalert2";

import { GlobalContext } from "../../context/Context";
import { baseUrl } from "../../core";

const Login = () => {
    const { state, dispatch } = useContext(GlobalContext);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const [alertMessage, setAlertMessage] = useState(null);

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
            setAlertMessage(response.data.message)
            // let timerInterval;
            // Swal.fire({
            //     // title: "Auto close alert!",
            //     html: "Login Successful",
            //     timer: 1000,
            //     timerProgressBar: true,
            //     didOpen: () => {
            //         Swal.showLoading();
            //         // const timer = Swal.getPopup().querySelector("b");
            //         timerInterval = setInterval(() => {
            //             // timer.textContent = `${Swal.getTimerLeft()}`;
            //         }, 100);
            //     },
            //     willClose: () => {
            //         clearInterval(timerInterval);
            //     }
            // }).then((result) => {
            //     /* Read more about handling dismissals below */
            //     if (result.dismiss === Swal.DismissReason.timer) {
            //         console.log("I was closed by the timer");
            //     }
            // });
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
        <div className="p-3">
            <h1 className="my-5 text-2xl font-semibold">Login Page</h1>
            {/* <h2>{state.name} <button onClick={changeNameHandler}>Change name</button></h2> */}
            {/* JSON.stringify(state) */}
            <form id="loginForm" onSubmit={loginSubmitHandler}>
                <label htmlFor="emailInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Email: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="email" id="emailInput" ref={emailInputRef} autoComplete="username" required />
                <br />
                <label htmlFor="passwordInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Password: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="password" id="passwordInput" ref={passwordInputRef} required />
                <br />
                <button className="p-1 my-4 bg-indigo-500 text-white border-2 border-indigo-500 rounded-md hover:bg-indigo-600 font-medium" type="submit">Login</button>
                {alertMessage && <p>{alertMessage}</p>}
            </form>
        </div>
    )
}

export default Login;