import express from "express";
// export const router = express.Router()
let router = express.Router()

// GET /api/v1/post/:userId/:postId
router.get("/posts/:userId", (req, res) => {
    res.send("one post")
}) 

// GET /api/v1/posts/:userId
router.get("/posts/:userId", (req, res) => {
    res.send("all posts")
}) 

// POST /api/v1/post
router.post("/posts/:userId", (req, res) => {
    res.send("post created")
})

// PUT /api/v1/post/:userId/:postId
router.put("/app/v1/posts/:userId", (req, res) => {
    res.send("post edited")
})

// DELETE /api/v1/post/:userId/:postId
router.get("/app/v1/posts/:userId", (req, res) => {
    res.send("post deleted")
})

export default router;