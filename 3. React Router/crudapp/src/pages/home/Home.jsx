import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Home.css"

import { baseUrl } from "../../core";

const Home = () => {
    const postTitleInputRef = useRef(null);
    const postTextInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [toggleRefresh, setToggleRefresh] = useState(false);
    // const [editAlertMessage, setEditAlertMessage] = useState(false);


    const getAllPosts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/v1/posts`, {
                withCredentials: true
            });
            console.log(response.data)
            setIsLoading(false)
            setAllPosts(response.data)
        } catch (e) {
            console.log(e.response.data)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllPosts();
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
            setAlertMessage(response.data.message)
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
            setAlertMessage(response.data.message);
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e.data);
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
        <div>
            <h1>Home Page</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="postTitleInput">Post Title:</label>
                <input type="text" id="postTitleInput" ref={postTitleInputRef} minLength={2} maxLength={50} required />
                <br />
                <label htmlFor="postTextInput">Post Text:</label>
                <textarea id="postTextInput" ref={postTextInputRef} minLength={2} maxLength={999} required />
                <br />
                <button type="submit">Publish Post</button>
            </form>
            <p>
                {alertMessage && alertMessage}
                {isLoading && "Loading..."}
            </p>
            <hr />

            <div>
                {allPosts.map((post, index) => {
                    return (
                        <div key={post._id} className="post">
                            {(post.isEdit) ? (
                                <form onSubmit={saveEditPostHandler}>
                                    <input type="text" value={post._id} disabled hidden />
                                    <input type="text" placeholder="Enter post title" defaultValue={post.title} required />
                                    <br />
                                    <textarea type="text" placeholder="Enter post text" defaultValue={post.text} required
                                    ></textarea>
                                    <br />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => {
                                        post.isEdit = false;
                                        setAllPosts([...allPosts]);
                                    }}>Cancel</button>
                                    {alertMessage && alertMessage}
                                    {isLoading && "Loading..."}
                                </form>
                            ) : (
                                <div>
                                    <h2>{post.title}</h2>
                                    <p>{post.text}</p>
                                    <button onClick={() => {
                                        allPosts[index].isEdit = true
                                        setAllPosts([...allPosts])
                                    }}>Edit</button>
                                    <button onClick={() => deletePostHandler(post._id)}>Delete</button>
                                </div>
                            )}



                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;