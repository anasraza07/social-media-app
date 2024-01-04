import express from "express";
let router = express.Router()
import { col } from "./post.mjs";

// GET /api/v1/feed/:userId
router.get("/feed", async (req, res) => {
    const cursor = col.find({})
        .sort({ _id: -1 })
        .limit(100)
    try {
        const results = await cursor.toArray();
        res.send({ data: results })
    } catch (err) {
        console.log(err)
    }
})


export default router;