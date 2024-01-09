import express from "express";
import jwt from "jsonwebtoken"
let router = express.Router();
import { ObjectId } from "mongodb";
import { userCollection } from "./routes/auth.mjs";

import authRouter from "./routes/auth.mjs"
import postRouter from "./routes/post.mjs"
import feedRouter from "./routes/feed.mjs"
import commentRouter from "./routes/comment.mjs"
import unAuthProfileRouter from "./unAuthRoutes/profile.mjs"

router.use(authRouter)

router.use((req, res, next) => { // JWT
    // console.log("cookies: ", req.cookies)

    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            _id: decoded._id,
            isAdmin: decoded.isAdmin
        };
        next();

    } catch (err) {
        // console.log(err)
        unAuthProfileRouter(req, res, next);
        // res.status(401).send({ message: "Invalid token" });
        return;
    }
})

router.use(postRouter) // Secure apis
router.use(feedRouter) // Secure apis

router.use("/ping", (req, res) => {
    res.send("OK");
})

router.post("/weather", (req, res) => {
    res.send({
        apiVersion: "v1",
        msg: "weather is normal",
        temp: 30,
        min: 20
    })
})

export default router;

