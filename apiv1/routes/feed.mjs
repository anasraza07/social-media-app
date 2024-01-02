import express from "express";
// export const router = express.Router()
let router = express.Router()

// GET /api/v1/feed/:userId
router.get("/feed/:userId", (req, res) => {
    res.send("all feed")
})


export default router;