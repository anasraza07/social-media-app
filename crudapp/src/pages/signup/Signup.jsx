import { useEffect, useRef, useContext, useState } from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import "./Signup.css"
import axios from "axios";

import { GlobalContext } from "../../context/Context";
import { baseUrl } from "../../core";

const Signup = () => {
    const { state, dispatch } = useContext(GlobalContext);

    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const repeatPasswordInputRef = useRef(null);

    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setAlertMessage("")
            setErrorMessage("")
        }, 3000)
    }, [alertMessage, errorMessage])

    const signupSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (repeatPasswordInputRef.current.value !== passwordInputRef.current.value) {
                console.log("Password don't match!")
                setPasswordError("Password don't match!")
                return;
            } else {
                setPasswordError("");
            }

            const axiosResponse = await axios.post(`${baseUrl}/api/v1/signup`, {
                firstName: firstNameInputRef.current.value,
                lastName: lastNameInputRef.current.value,
                email: emailInputRef.current.value,
                password: passwordInputRef.current.value
            })
            console.log(axiosResponse.data);
            window.location.href = "/login"
            setAlertMessage(axiosResponse.data.message)

        } catch (e) {
            console.log(e.response.data)
            setErrorMessage(e.response.data.message);
        }
    }

    return (
        <div className="p-3">
            <h1 className="my-5 text-2xl text-center font-semibold">Signup Page</h1>
            <h2>{state.name}</h2>
            <form className="w-full sm:w-6/12 sm:m-auto" onSubmit={signupSubmitHandler}>
                <label htmlFor="firstNameInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">First Name: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" id="firstNameInput" ref={firstNameInputRef} required />
                <br />
                <label htmlFor="lastNameInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Last Name: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" id="lastNameInput" ref={lastNameInputRef} required />
                <br />
                <label htmlFor="emailInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Email: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="email" id="emailInput" ref={emailInputRef} required />
                <br />
                <label htmlFor="passwordInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Password: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="password" id="passwordInput" ref={passwordInputRef} required />
                <br />
                <label htmlFor="repeatPasswordInput" className="block mb-2 text-lg font-medium text-indigo-600 my-1">Repeat Password: </label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="password" id="repeatPasswordInput" ref={repeatPasswordInputRef} required />
                {/* <br /> */}
                <button className="p-1 my-4 bg-indigo-500 text-white border-2 border-indigo-500 rounded-md hover:bg-indigo-600 font-medium" type="submit">Signup</button>
                {passwordError && <p className="passwordError">{passwordError}</p>}
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                {alertMessage && <p className="alertMessage">{alertMessage}</p>}
                <p className="text-center mt-1">Have an account? <Link className="font-bold text-indigo-500" to={"/login"}> Log in </Link></p>
            </form>
        </div>
    )
}

export default Signup;