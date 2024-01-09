import express from "express";
// import { nanoid } from "nanoid";
import { client } from "../../mongodb.mjs";
import { ObjectId } from "mongodb";
import { userCollection } from "../../apiv1/routes/auth.mjs";
let router = express.Router();

const db = client.db("cruddb");
export const col = db.collection("posts");

// GET /api/v1/posts?id=12345678987654367
router.get("/posts", async (req, res) => {
    const userId = req.query.id;
    // console.log(userId)

    if (!ObjectId.isValid(userId) && userId !== undefined) {
        res.status(403).send({ message: "Invalid user id" });
        return;
    }

    const cursor = col.find({ authorId: new ObjectId(userId) })
        .sort({ _id: -1 })
        .limit(5);
    try {
        const results = await cursor.toArray();
        // console.log("results", results)
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.send("server error, please try again later");
    }
})

router.get("/profile/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (!ObjectId.isValid(userId) && userId !== undefined) {
        res.status(403).send({ message: "Invalid user id" });
        return;
    }

    try {
        const result = await userCollection.findOne({ _id: new ObjectId(userId) });
        // console.log(result)
        res.send({
            message: "Profile fetched",
            data: {
                firstName: result?.firstName,
                lastName: result?.lastName,
                email: result?.email,
            }
        });
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send("server error, please try later");
    }
})

router.use((req, res) => {
    res.status(401).send({ message: "Invalid token" })
    return;
})

export default router;