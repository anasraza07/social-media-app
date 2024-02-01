import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css"
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader"

import { baseUrl } from "../../core";
import { GlobalContext } from "../../context/Context";

const Home = () => {
    const { state, dispatch } = useContext(GlobalContext);

    const postTitleInputRef = useRef(null);
    const postTextInputRef = useRef(null);

    const [alertMessage, setAlertMessage] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alLPostsLoader, setAllPostsLoader] = useState(false);

    const getAllPosts = async () => {
        // setAllPostsLoader(true);
        try {
            const response = await axios.get(`${baseUrl}/api/v1/feed`, {
                withCredentials: true
            })
            console.log(response.data)
            // setAllPostsLoader(false)
            setAllPosts([...response.data.data])
        }
        catch (err) {
            console.log(err.response?.data)
            // setAllPostsLoader(false)
        }
    }

    useEffect(() => {
        getAllPosts();
    }, [toggleRefresh])

    const submitHandler = async (e) => {
        e.preventDefault();
        // setIsLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/api/v1/post`, {
                title: postTitleInputRef.current.value,
                text: postTextInputRef.current.value
            }, {
                withCredentials: true
            })
            console.log(response.data);
            // setIsLoading(false);
            toast.success(`${response?.data.message}`, { autoClose: 1000 })
            e.target.reset()
            // text.reset()
            // setAlertMessage(response.data.message)
            // getAllPosts();
            setToggleRefresh(!toggleRefresh);
        } catch (err) {
            console.log(err.data)
            // setIsLoading(false)
        }
    }

    const deletePostHandler = async (postId) => {
        // setIsLoading(true)
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/post/${postId}`)
            console.log(response.data);
            // setIsLoading(false);
            toast.error(`${response?.data.message}`, { autoClose: 1000 })
            // setAlertMessage(response.data.message);
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e.data);
            // setIsLoading(false)
        }
    }

    const saveEditPostHandler = async (e) => {
        e.preventDefault();

        const _id = e.target.elements[0].value;
        const title = e.target.elements[1].value;
        const text = e.target.elements[2].value;

        // setIsLoading(true)
        try {
            const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
                title,
                text
            })
            console.log(response.data);
            // setIsLoading(false);
            toast.success(`${response?.data.message}`, { autoClose: 1000 })
            // setAlertMessage(response.data.message);
            setToggleRefresh(!toggleRefresh);
        } catch (err) {
            console.log(err.data);
            // setIsLoading(false)
        }
    }

    return (
        <div className="p-5">
            {/* <h1 className="text-center text-3xl font-bold">Home Page (Your Feed)</h1> */}
            <h1 className="my-2 text-center text-2xl font-semibold">Publish Your Post</h1>
            <form onSubmit={submitHandler}>
                <label className="block mb-2 text-lg font-medium text-indigo-600 my-1" htmlFor="postTitleInput">Post Title:</label>
                <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5 mb-1" type="text" id="postTitleInput" ref={postTitleInputRef} minLength={2} maxLength={50} placeholder="Enter Your Title..." required />
                <br />
                <label className="block mb-2 text-lg font-medium text-indigo-500 my-1" htmlFor="postTextInput">Post Text:</label>
                <textarea className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg  block w-full p-2.5 focus:outline-none focus:border-2 focus:border-indigo-300 " id="postTextInput" ref={postTextInputRef} minLength={2} maxLength={999} placeholder="Enter Some Text..." required rows={3} />
                <br />
                {!isLoading ? <button type="submit" className="p-1 mb-4 bg-indigo-500 text-white border-2 border-indigo-500 rounded-md hover:bg-indigo-600 font-medium">Publish Post</button>
                    : (<div>
                        <ClipLoader color="black" loading={true} size={30} />
                    </div>)}
            </form>
            <p>
                {/* {alertMessage && alertMessage} */}
                {/* {isLoading && "Loading..."} */}
            </p>
            <hr />

            <div className="py-4">
                {alLPostsLoader ? (
                    <div className="flex justify-center"><ClipLoader color="black" loading={true} size={30} /></div>) :
                    allPosts.map((post, index) => {
                        return (
                            <div key={post._id} className="post">
                                {(post.isEdit) ? (
                                    <div className="bg-white m-4 p-4 shadow-md">
                                        <form onSubmit={saveEditPostHandler}>
                                            <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" value={post._id} disabled hidden />
                                            <input className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5" type="text" placeholder="Enter post title" defaultValue={post.title} required />
                                            <br />
                                            <textarea className="bg-white border border-gray-400 text-gray-900 text-lg rounded-lg focus:outline-none focus:border-2 focus:border-indigo-300 w-full p-2.5 mt-2" type="text" placeholder="Enter post text" defaultValue={post.text} required rows={3}
                                            ></textarea>
                                            <br />
                                            <div className="flex items-center gap-1">
                                                {!isLoading ? <button className="p-1 px-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 font-medium my-4">Save</button>
                                                    : <span>
                                                        <ClipLoader color="black" loading={true} size={30} />
                                                    </span>}
                                                <button className="p-1 px-2 bg-transparent text-blue-500 border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 hover:text-white font-medium my-4 ml-1" type="button" onClick={() => {
                                                    post.isEdit = false;
                                                    setAllPosts([...allPosts]);
                                                }}>Cancel</button>
                                            </div>
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
                                        {state.user._id === post.authorId ? (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => {
                                                    allPosts[index].isEdit = true
                                                    setAllPosts([...allPosts])
                                                }} className="p-1 px-2 bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 font-medium my-4">Edit</button>
                                                <button onClick={() => deletePostHandler(post._id)} className="p-1 px-2 bg-red-500 text-white border-2 border-red-500 rounded-md hover:bg-red-600 hover:border-red-600 font-medium my-4">Delete</button>
                                                {/* // :<span>
                                                    //     <ClipLoader color="black" loading={true} size={30} />
                                                    // </span> */}

                                            </div>
                                        ) : null}
                                    </div>
                                )
                                }
                            </div>
                        )
                    })}
            </div>
        </div >
    )
}

export default Home;