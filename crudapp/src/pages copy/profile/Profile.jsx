import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css"
import { toast } from "react-toastify";

import { baseUrl } from "../../core";
import { GlobalContext } from "../../context/Context";

const Profile = () => {
    const { state, dispatch } = useContext(GlobalContext)

    const postTitleInputRef = useRef(null);
    const postTextInputRef = useRef(null);

    const [alertMessage, setAlertMessage] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState({});

    const { userId } = useParams()

    const getAllPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/v1/posts?id=${userId || ""}`, {
                withCredentials: true
            });
            console.log(response?.data)
            setIsLoading(false)
            setAllPosts([...response.data])
        } catch (err) {
            console.log(err.response?.data)
            setIsLoading(false)
        }
    }

    const getProfile = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/profile/${userId || ""}`)
            console.log(response.data)
            setProfile(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllPosts();
        getProfile()
    }, [toggleRefresh])

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/api/v1/post`, {
                title: postTitleInputRef.current.value,
                text: postTextInputRef.current.value
            }, {
                withCredentials: true
            })
            console.log(response.data);
            setIsLoading(false);
            // setAlertMessage(response.data.message)
            e.target.reset()
            // getAllPosts();
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e.data)
            setIsLoading(false)
        }
    }

    const deletePostHandler = async (postId) => {
        setIsLoading(true)
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/post/${postId}`)
            console.log(response.data);
            setIsLoading(false);
            toast.error(`${response?.data.message}`, { autoClose: 1000 })
            // setAlertMessage(response.data.message);
            setToggleRefresh(!toggleRefresh);
        } catch (err) {
            console.log(err.data);
            setIsLoading(false)
        }
    }

    const saveEditPostHandler = async (e) => {
        e.preventDefault();

        const _id = e.target.elements[0].value;
        const title = e.target.elements[1].value;
        const text = e.target.elements[2].value;

        setIsLoading(true)
        try {
            const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
                title,
                text
            })
            console.log(response.data);
            setIsLoading(false);
            setAlertMessage(response.data.message);
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false)
        }
    }

    return (
        <div className="p-5">
            {/* <h1 className="my-2 text-2xl font-semibold">Profile Page</h1> */}
            <div className="banner">
                <div className="bannerImg"></div>
                <div className="profileImg"></div>
                <div className="profileName">
                    <h2 className="mb-4 text-2xl text-end font-bold capitalize text-indigo-800"> {profile?.firstName} {profile?.lastName} </h2>
                    <hr />
                </div>
            </div>
            {state.user._id === userId ? (
                <div>
                    <form onSubmit={submitHandler}>
                        <label className="block mb-2 text-lg font-medium text-indigo-600 my-1" htmlFor="postTitleInput">Post Title:</label>
                        <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5 mb-1" type="text" id="postTitleInput" ref={postTitleInputRef} minLength={2} maxLength={50} required />
                        <br />
                        <label className="block mb-2 text-lg font-medium text-indigo-500 my-1" htmlFor="postTextInput">Post Text:</label>
                        <textarea className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg  block w-full p-2.5 focus:outline-none focus:border-2 focus:border-indigo-300" id="postTextInput" ref={postTextInputRef} minLength={2} maxLength={999} required />
                        <br />
                        <button className="p-1 mb-4 bg-indigo-500 text-white border-2 border-indigo-500 rounded-md hover:bg-indigo-600 font-medium" type="submit">Publish Post</button>
                    </form>
                    <p>
                        {alertMessage && alertMessage}
                        {isLoading && "Loading..."}
                    </p>
                    <hr />
                </div>
            ) : null}

            <div>
                <h3 className="mt-3 text-center font-semibold text-xl">Your Posts</h3>
                {allPosts.map((post, index) => {
                    return (
                        <div key={post._id} className="post">
                            {(post.isEdit) ? (
                                <div className="bg-white m-4 p-4 shadow-md">
                                    <form onSubmit={saveEditPostHandler}>
                                        <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" value={post._id} disabled hidden />
                                        <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" placeholder="Enter post title" defaultValue={post.title} required />
                                        <br />
                                        <textarea className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5 mt-2" type="text" placeholder="Enter post text" defaultValue={post.text} required
                                        ></textarea>
                                        <br />
                                        <button className="p-1 px-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 font-medium my-4" type="submit">Save</button>
                                        <button className="p-1 px-2 bg-transparent text-blue-500 border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 hover:text-white font-medium my-4 ml-1" type="button" onClick={() => {
                                            post.isEdit = false;
                                            setAllPosts([...allPosts]);
                                        }}>Cancel</button>
                                        {alertMessage && alertMessage}
                                        {isLoading && "Loading..."}
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-white m-4 p-4 shadow-md">
                                    <div className="flex flex-wrap items-center gap-2 mb-6">
                                        <div className="w-10 h-10 bg-indigo-200 rounded-full"></div>
                                        <p className="font-medium text-indigo-800">{post.authorEmail}</p>
                                    </div>
                                    <h2 className="text-2xl font-bold my-2">{post.title}</h2>
                                    <p className="text-lg font-medium my-2">{post.text}</p>
                                    <button className="p-1 px-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 font-medium my-4" onClick={() => {
                                        allPosts[index].isEdit = true
                                        setAllPosts([...allPosts])
                                    }}>Edit</button>
                                    <button className="p-1 px-2 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-600 hover:border-red-600 font-medium my-4 ml-1" onClick={() => deletePostHandler(post._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            {allPosts.length === 0 && (<div>No Data</div>)}
        </div >
    )
}

export default Profile;