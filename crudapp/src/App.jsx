import { useEffect, useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom"
import axios from "axios";
import "./App.css"
import { toast, ToastContainer } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader"
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import AdminHome from "./pages copy/admin home/AdminHome";
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
      // setLoader(true);
      await new Promise(async (resolve) => {
        // setTimeout(async () => {
        resolve(
          await axios.post(`${baseUrl}/api/v1/logout`, {}, {
            withCredentials: true
          })
        )
        // }, 1000)
      });
      // setLoader(false)
      toast(<div className="flex items-center gap-2">
        <ClipLoader color="black" loading={true} size={20} />
        Logging out...</div>, {
        autoClose: 1000,
        onClose: async () => {
          await dispatch({
            type: "USER_LOGOUT"
          })
          window.location.href = "/"
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="">
      {/* admin routes */}
      {state.isLogin === true && state.role === "admin" ? (
        <div>
          <nav className="mb-3 py-5 flex flex-col gap-3 justify-between items-center bg-white sticky top-0 border-b-gray-300 border-b-2 sm:px-10 sm:flex-col sm:gap-5 sm:items-center md:flex-row">
            <ul className="authorized-ul flex gap-2 sm:gap-4">
              <li><Link className="p-1 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={"/"}>Admin Home</Link></li>
              <li><Link className="p-1 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={`/profile/${state.user._id}`}>Admin Profile</Link></li>
              <li><Link className="p-1 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={"/chat"}>Admin Chat</Link></li>
            </ul>
            <div className="flex items-center gap-2">
              <div className="font-bold  text-indigo-800">{state.user.email}</div>
              <button className="p-1 sm:px-2 text-indigo-500 bg-transparent border-2 border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white font-medium" onClick={logoutSubmitHandler}>Logout</button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<AdminHome />} />
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
          <nav className="mb-3 py-5 flex flex-col gap-3 justify-between items-center bg-white sticky top-0 border-b-gray-300 border-b-2 sm:px-10 sm:flex-col sm:gap-5 sm:items-center md:flex-row">
            <ul className="authorized-ul flex gap-4">
              <li><Link className="p-1 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={"/"}>Home</Link></li>
              <li><Link className="p-1 sm:px-2 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={"/about"}>About</Link></li>
              <li><Link className="p-1 sm:px-2 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={`/profile/${state.user._id}`}>Profile</Link></li>
              <li><Link className="p-1 sm:px-2 bg-indigo-500 text-white rounded-md border-2 border-indigo-500 hover:bg-transparent hover:text-indigo-500 font-medium" to={"/chat"}>Chat</Link></li>
            </ul>
            <div className="flex items-center gap-2">
              <div className="font-bold  text-indigo-800">{state.user.email}</div>
              <button className="p-1 sm:px-2 text-indigo-500 bg-transparent border-2 border-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white font-medium" onClick={logoutSubmitHandler}>Logout</button>
            </div>
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
          <nav className="my-5 p-3 items-center sm:pl-10 sm:flex-col sm:gap-5 sm:items-center md:flex-row">
            <ul className="unAuth-ul flex justify-end    gap-3">
              <li className="p-1 bg-transparent text-indigo-500 rounded-md border-2 border-indigo-500 hover:text-white hover:bg-indigo-500 font-medium"><Link to={"/login"}>Login</Link></li>
              <li className="p-1 bg-transparent text-indigo-500 rounded-md border-2 border-indigo-500 hover:text-white hover:bg-indigo-500 font-medium"><Link to={"/signup"}>Signup</Link></li>
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
      <ToastContainer className="" />
    </div>
  );
}

export default App;




