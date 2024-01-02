import express from "express";
// import { nanoid } from "nanoid";
import { client } from "../../mongodb.mjs";
import { ObjectId } from "mongodb";
import { userCollection } from "./auth.mjs";

const db = client.db("cruddb");
const col = db.collection("posts");

let router = express.Router()

// GET /api/v1/post/:userId/:postId
router.get("/post/:postId", async (req, res) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send("Invalid post id")
        return;
    }

    // if (isNaN(req.params.postId)) {
    //     res.send({ message: `post id must be a valid number, no alphabet is allowed in post id` })
    //     return;
    // }

    // MongoDb Query Operators Example:
    // const cursor = col.find({ price: { $not: { $gt: 77 } } })
    // const cursor = col.find({
    //     // $and: [
    //     //     { _id: req.params.postId },
    //     //     { title: "asdfgh" }
    //     // ]
    //     $or: [
    //             { _id: req.params.postId },
    //         { title: "something" }
    //     ]
    // })

    try {
        const results = await col.findOne({ _id: new ObjectId(req.params.postId) });
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send("server error, please try later");
    }
})

// GET /api/v1/posts/:userId
router.get("/posts", async (req, res) => {
    const cursor = col.find({})
        .sort({ _id: -1 })
        .limit(100);
    try {
        let results = await cursor.toArray();
        // console.log("results", results)
        res.send(results)
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.send("server error, please try again later");
    }
})

// POST /api/v1/post
router.post("/post", async (req, res) => {
    if (!req.body.title
        || !req.body.text
    ) {
        res.status(403).send({
            message: `required parameter missing,
            example request body: 
            {
                id: 1234,
                title: "My title",
                text: "some text"
            } `}) // self documented api
        return;
    }

    let newPost = {
        // _id: "48346932659432659743265" // database will issue this unique id itself
        title: req.body.title,
        text: req.body.text,
        createdOn: new Date()
    }
    try {

        const insertResponse = await col.insertOne(newPost);
        console.log("insertResponse", insertResponse);
        res.send({ message: "Post created" })

    } catch (e) {
        console.log("error inserting mongodb: ", e)
        res.send("server error, please try again later")
    }
})

// PUT /api/v1/post/:userId/:postId
// {
//     title:"updated title",
//     text: "updated text"
// }
router.put("/post/:postId", async (req, res) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send("Invalid post id")
        return;
    }

    if (!req.body.title
        && !req.body.text) {
        res.status(403).send({
            message: `required parameter missing, atleast one is required.
            example put body:
        {
            title: req.body.title,
            text: req.body.text
        }`
        })
        return;
    }

    const dataToBeUpdated = {}
    if (req.body.title) { dataToBeUpdated.title = req.body.title }
    if (req.body.text) { dataToBeUpdated.text = req.body.text }

    try {
        const updateResponse = await col.updateOne({ _id: new ObjectId(req.params.postId) },
            {
                $set: dataToBeUpdated
            }
        )
        console.log("updateResponse: ", updateResponse)
        res.send({ message: "Post updated" })
    } catch (e) {
        console.log("error updating mongodb: ", e);
        res.status(500).send("server error, please try later");
    }

})

// DELETE /api/v1/post/:userId/:postId
router.delete("/post/:postId", async (req, res) => {
    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send("Invalid post id")
        return;
    }

    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) })
        console.log("deleteResponse: ", deleteResponse)
        res.send({ message: "Post deleted" })
    } catch (e) {
        console.log("error updating mongodb: ", e);
        res.status(500).send("server error, please try later");
    }
})

router.get("/profile", async (req, res) => {
    try {
        const result = await userCollection.findOne({ email: req.body.decoded.email });
        res.send({
            message: "Profile fetched",
            data: {
                isAdmin: result.isAdmin,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            }
        });
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send("server error, please try later");
    }
})


export default router;