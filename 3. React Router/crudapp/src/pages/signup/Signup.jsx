import { useEffect, useRef, useContext, useState } from "react"
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
            setAlertMessage(axiosResponse.data.message)

        } catch (e) {
            console.log(e.response.data)
            // console.log(e.response.data);
            setErrorMessage(e.response.data.message);
        }
    }

    return <div>
        <h1>Signup Page</h1>
        <h2>{state.name}</h2>
        <form onSubmit={signupSubmitHandler}>
            <label htmlFor="firstNameInput">First Name: </label>
            <input type="text" id="firstNameInput" ref={firstNameInputRef} required />
            <br />
            <label htmlFor="lastNameInput">Last Name: </label>
            <input type="text" id="lastNameInput" ref={lastNameInputRef} required />
            <br />
            <label htmlFor="emailInput">Email: </label>
            <input type="email" id="emailInput" ref={emailInputRef} required />
            <br />
            <label htmlFor="passwordInput">Password: </label>
            <input type="password" id="passwordInput" ref={passwordInputRef} required />
            <br />
            <label htmlFor="repeatPasswordInput">Repeat Password: </label>
            <input type="password" id="repeatPasswordInput" ref={repeatPasswordInputRef} required />
            <br />
            {passwordError && <p className="password-error">{passwordError}</p>}
            <button type="submit">Signup</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {alertMessage && <p className="alert-message">{alertMessage}</p>}
        </form>
    </div>
}

export default Signup;