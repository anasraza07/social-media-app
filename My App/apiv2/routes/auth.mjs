import express from "express";
// export const router = express.Router()
let router = express.Router()


router.post("/login", (req, res) => {
    console.log("this is login v2", new Date())
    res.send("This is login v2! " + new Date())
})

router.post("/signup", (req, res) => {
    console.log("this is signup v2", new Date())
    res.send("This is signup v2! " + new Date())
})

export default router;
