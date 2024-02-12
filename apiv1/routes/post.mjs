import express from "express";
// import { nanoid } from "nanoid";
import { client } from "../../mongodb.mjs";
import { ObjectId } from "mongodb";

const db = client.db("cruddb");
export const col = db.collection("posts");
import { userCollection } from "./auth.mjs";
import bucket from "../../firebaseAdmin/index.mjs"
import fs from "fs";

import multer from "multer"
const storageConfig = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("mul-file", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var uploadMiddleware = multer({ storage: storageConfig })

let router = express.Router();

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

// GET /api/v1/posts?id=12345678987654367
router.get("/posts", async (req, res) => {
    const userId = req.query.id || req.body.decoded._id;
    // console.log(userId)

    if (!ObjectId.isValid(userId)) {
        res.status(403).send({ message: "Invalid user id" });
        return;
    }

    const cursor = col.find({ authorId: new ObjectId(userId) })
        .sort({ _id: -1 })
        .limit(100);
    try {
        const results = await cursor.toArray();
        // console.log("results", results)
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.send("server error, please try again later");
    }
})

// POST /api/v1/post
router.post("/post", (req, res, next) => {
    req.decoded = { ...req.body.decoded }
    next();
},
    uploadMiddleware.any(),

    async (req, res) => {

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

        console.log("req.body: ", req.body);
        console.log("req.files: ", req.files);

        console.log("uploaded file name: ", req.files[0].originalname);
        console.log("file type: ", req.files[0].mimetype);
        console.log("file name in server folders: ", req.files[0].filename);
        console.log("file path in server folders: ", req.files[0].path);

        bucket.upload(
            req.files[0].path,
            {
                destination: `postPictures/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // console.log("api resp: ", apiResponse);

                    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2999'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                            // // delete file from folder before sending response back to client (optional but recommended)
                            // // optional because it is gonna delete automatically sooner or later
                            // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }

                            let newPost = {
                                // _id: "48346932659432659743265" // database will issue this unique id itself
                                title: req.body.title,
                                text: req.body.text,
                                img: urlData[0],
                                authorEmail: req.decoded.email,
                                authorId: new ObjectId(req.decoded._id),
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
                        }
                    })

                } else {
                    console.log("err: ", err)
                    res.status(500).send({ message: "server error" });
                }
            });

        // let newPost = {
        //     // _id: "48346932659432659743265" // database will issue this unique id itself
        //     title: req.body.title,
        //     text: req.body.text,
        //     authorEmail: req.body.decoded.email,
        //     authorId: new ObjectId(req.body.decoded._id),
        //     createdOn: new Date()
        // }
        // try {
        //     const insertResponse = await col.insertOne(newPost);
        //     console.log("insertResponse", insertResponse);
        //     res.send({ message: "Post created" })

        // } catch (e) {
        //     console.log("error inserting mongodb: ", e)
        //     res.send("server error, please try again later")
        // }
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

const getProfileMiddleware = async (req, res) => {
    const userId = req.params.userId || req.body.decoded._id;
    if (!ObjectId.isValid(userId)) {
        res.status(403).send({ message: "Invalid user id" });
        return;
    }

    try {
        const result = await userCollection.findOne({ _id: new ObjectId(userId) });
        // console.log(result)
        res.send({
            message: "Profile fetched",
            data: {
                isAdmin: result?.isAdmin,
                firstName: result?.firstName,
                lastName: result?.lastName,
                email: result?.email,
                _id: result?._id
            }
        });
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send("server error, please try later");
    }
}
router.get("/profile", getProfileMiddleware)
router.get("/profile/:userId", getProfileMiddleware)

export default router;