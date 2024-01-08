import { useEffect, useState, useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom"
import axios from "axios";
import "./App.css"

import Home from "./pages/home/Home";
import About from "./pages/about/About"
import Profile from "./pages/profile/Profile";
import Chat from "./pages/chat/Chat";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import splashScreen from "./assets/splash-screen.gif"

import { GlobalContext } from "./context/Context";
import { baseUrl } from "./core";

function App() {
  const { state, dispatch } = useContext(GlobalContext)

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true
        })
        console.log(response.data.message)
        setTimeout(() => {
          dispatch({
            type: "USER_LOGIN",
            payload: response.data.data
          })
        }, 1000)
      } catch (err) {
        console.log(err.response?.data)
        setTimeout(() => {
          dispatch({
            type: "USER_LOGOUT"
          })
        }, 1000)
      }
    }
    checkLoginStatus();
  }, [])

  const logoutSubmitHandler = async () => {
    try {
      await axios.post(`${baseUrl}/api/v1/logout`, {}, {
        withCredentials: true
      })
      dispatch({
        type: "USER_LOGOUT"
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {/* admin routes */}
      {state.isLogin === true && state.role === "admin" ? (
        <div>
          <nav>
            <ul className="authorized-ul">
              <li><Link to={"/"}>Admin Home</Link></li>
              <li><Link to={`/profile/${state.user._id}`}>Admin Profile</Link></li>
              <li><Link to={"/chat"}>Admin Chat</Link></li>
              {state.user.email}
              <li className="logout" onClick={logoutSubmitHandler}><Link>Logout</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="chat" element={<Chat />} />

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      ) : null}

      {/* user routes */}
      {state.isLogin === true && state.role === "user" ? (
        <div>
          <nav>
            <ul className="authorized-ul">
              <li><Link to={"/"}>Home</Link></li>
              <li><Link to={"/about"}>About</Link></li>
              <li><Link to={`/profile/${state.user._id}`}>Profile</Link></li>
              <li><Link to={"/chat"}>Chat</Link></li>
              {state.user.email}
              <li className="logout" onClick={logoutSubmitHandler}><Link>Logout</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="chat" element={<Chat />} />

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </div>
      ) : null}

      {/* unAuth routes */}
      {state.isLogin === false ? (
        <div>
          <nav>
            <ul className="unAuth-ul">
              <li><Link to={"/login"}>Login</Link></li>
              <li><Link to={"/signup"}>Signup</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile/:userId" element={<Profile />} />

            <Route path="*" element={<Navigate to="/login" replace={true} />} />
          </Routes>
        </div>
      ) : null}

      {/* splash screen */}
      {state.isLogin === null ? (
        <div>
          <img style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0
          }} src={splashScreen} alt="" />
        </div>
      ) : null}
    </div>
  );
}

export default App;
