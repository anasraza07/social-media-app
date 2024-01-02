import express from "express";
// export const router = express.Router()
let router = express.Router()

// GET /api/v2/comment/:postId/:commentId
router.get("/comment/:postId/:commentId", (req, res) => {
    console.log(req.params)
    res.send("one comment is here")
})

// GET /api/v2/comments/:postId
router.get("/comments/:postId", (req, res) => {
    res.send("all comments")
})

// POST /api/v2/comment
router.post("/comment", (req, res) => {
    res.send("comment created")
})

// PUT /api/v2/comment/:postId/:commentId
router.put("/comment/:postId/:commentId", (req, res) => {
    res.send("comment edited")
})

// DELETE /api/v2/comment/:postId/:commentId
router.delete("/comment/:postId/:commentId", (req, res) => {
    res.send("comment deleted")
})

export default router;