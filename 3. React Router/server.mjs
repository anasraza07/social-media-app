import express from "express";
import path from "path";
import cors from "cors";
const __dirname = path.resolve();
import cookieParser from "cookie-parser";
import "dotenv/config";

import apiv1Router from "./apiv1/index.mjs"
import apiv2Router from "./apiv2/index.mjs"

const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser
app.use(cors({ origin: ["http://localhost:3001", "http://localhost:3000"], credentials: true }));

app.use("/api/v1", apiv1Router) // nested mini routes
app.use("/api/v2", apiv2Router) // nested mini routes

app.use('/', express.static(path.join(__dirname, 'crudapp/build')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/crudapp/build/index.html"))
    // res.redirect("/"); // for school or any data entry form website.
})
// app.use('/static', express.static(path.join(__dirname, 'static')))

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
});