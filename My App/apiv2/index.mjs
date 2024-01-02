import express from "express";
let router = express.Router();

import authRouter from "./routes/auth.mjs"
import feedRouter from "./routes/feed.mjs"
import postRouter from "./routes/post.mjs"
import commentRouter from "./routes/comment.mjs"

router.use(authRouter)

router.use((req, res, next) => {
    if (token === "valid") {
        next();
    }
    else {
        res.send({ message: "Invalid token" })
    }
})

router.use(feedRouter)
router.use(postRouter)
router.use(commentRouter)

router.post("/api/v2/weather", (req, res) => {
    res.send({
        apiVersion: "v2",
        msg: "weather is normal",
        temp: 30,
        min: 20
    })
})

export default router;

