import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import booksRoute from "./routes/booksRoute.js";
import { Book } from "./models/bookModel.js";

import mongoose from "mongoose";
const app = express();

//to parse the request body, we use a middleware
app.use(express.json());

//middle ware to handle CORS:
app.use(cors());

app.get("/", (request, response) => {
    console.log(request);
    return response.status(234).send("Helicopter");
}); //using the get method
app.use('/books', booksRoute); //middleware

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app is connected to the database");
        //making sure the server only runs if the connection is successful
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
//to handle different situations of success and failure
