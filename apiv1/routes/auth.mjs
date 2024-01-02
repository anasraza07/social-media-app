import express from "express";
let router = express.Router()
import { client } from "../../mongodb.mjs";
import { stringToHash, verifyHash, validateHash } from "bcrypt-inzi";
import jwt from "jsonwebtoken";

export const userCollection = client.db("cruddb").collection("users")

router.post("/signup", async (req, res) => {
    if (!req.body?.firstName
        || !req.body?.lastName
        || !req.body?.email
        || !req.body?.password) {
        res.send(`required parameter missing, example request body:
            {
                firsName: some firsName,
                lastName: some lastName,
                email: some@email.com,
                password: some$password
        }`)
        return;
    }

    // validate email | optional
    req.body.email = req.body.email.toLowerCase();

    try {
        const result = await userCollection.findOne({ email: req.body.email })
        console.log("result: ", result)

        if (!result) { // user not found

            const passwordHash = await stringToHash(req.body.password)

            const insertResponse = await userCollection.insertOne({
                isAdmin: false,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
                createdOn: new Date()
            })
            console.log("insertResponse: ", insertResponse)
            res.send({ message: "Signup successful!" });

        } else { // user already exist
            res.status(403).send({
                message: "User already exist with this email!"
            });
        }
    } catch (e) {
        console.log("error inserting mongodb: ", e)
        res.status(500).send("server error, please try later")
    }
})

router.post("/login", async (req, res) => {
    if (!req.body?.email
        || !req.body?.password) {
        res.send(`required parameter missing, example request body:
            {
                email:some email,
                password:some password
        }`)
        return;
    }
    try {
        const result = await userCollection.findOne({ email: req.body.email })
        console.log("result: ", result)

        if (!result) { // user not found
            res.status(403).send({
                message: "email or password is incorrect"
            })
            return;
        } else { // user found

            const isMatch = await verifyHash(req.body.password, result.password)

            if (isMatch) {
                // TODO:  create token for this user
                const token = jwt.sign({
                    isAdmin: result.isAdmin,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: req.body.email,
                }, process.env.SECRET, {
                    expiresIn: '24h'
                })

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 86400000)
                })

                res.send({
                    message: "Login successful",
                    data: {
                        isAdmin: result.isAdmin,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: req.body.email,
                    }
                })
                return;
            } else {
                res.status(401).send({
                    message: "email or password is incorrect"
                })
                return;
            }
        }
    } catch (e) {
        console.log("error inserting mongodb: ", e)
        res.status(500).send("server error, please try later")
    }
})

router.post("/logout", async (req, res) => {
    res.clearCookie("token");
    res.send({ message: "Logout Successful" })
})
export default router;
